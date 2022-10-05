using System.Linq;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Departments.Queries.GetDepartmentPlan
{
    public class GetDepartmentPlanRequestHandler : IRequestHandler<GetDepartmentPlanRequest, DepartmentPlanRecordVm[]>
    {
        private readonly ITasklyDbContext _dbContext;
        public GetDepartmentPlanRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<DepartmentPlanRecordVm[]> Handle(GetDepartmentPlanRequest request, CancellationToken cancellationToken)
        {
            var res = new List<DepartmentPlanRecordVm>();

            // get department by id
            var dep = await _dbContext.Departments
                .Include(d => d.UserDepartments).ThenInclude(d => d.UserPosition)
                .Include(d => d.UserDepartments).ThenInclude(d => d.User)
                .AsNoTracking()
                .FirstAsync(i => i.Id == request.DepartmentId, cancellationToken);

            // get users of the department
            var users = dep.UserDepartments;

            // get projects that have any estimation for the given department
            var projects = await _dbContext.Projects
                .Include(i => i.Tasks).ThenInclude(i => i.DepartmentEstimations).ThenInclude(i => i.Department)
                .Include(i => i.Tasks).ThenInclude(i => i.DepartmentEstimations).ThenInclude(i => i.Estimations)
                .AsNoTracking()
                .Where(
                    p => p.Tasks.Any(t =>
                        request.Start <= t.End && t.Start <= request.End &&
                        t.DepartmentEstimations.Any(de => de.Department.Id == request.DepartmentId && de.Estimations.Sum(des => des.Hours) > 0))
                )
                .ToListAsync(cancellationToken);

            // laod plans for each employee for each week for each project
            var plans = await _dbContext.DepartmentPlans
                .Include(i => i.Project).Include(i => i.User)
                .AsNoTracking()
                .Where(t =>
                    t.DepartmentId == request.DepartmentId &&
                    t.WeekStart >= request.Start && t.WeekStart <= request.End)
                .ToListAsync(cancellationToken);

            // add projects that have already been planned before for the given department
            var plannedProjects = plans.Select(i => i.Project).ToList();
            projects.AddRange(plannedProjects);
            projects = projects.DistinctBy(i => i.Id).OrderBy(i => i.Id).ToList();

            // get non-working days to calculate how many working hours should be planned
            // todo handle sick days
            var nonWorkingDays = await _dbContext.Calendar.Where(i => i.Date >= request.Start && i.Date <= request.End)
                .ToDictionaryAsync(i => i.Date, i => i.DayType, cancellationToken);

            // compose view model
            foreach (var user in users)
            {
                // build a list of weeks according to start and end dates            
                var weeks = BuildWeeks(user, request.Start, request.End, nonWorkingDays);

                var vm = new DepartmentPlanRecordVm
                {
                    UserId = user.User.Id,
                    UserName = user.User.Name,
                    QuitDate = user.User.QuitDate,
                    UserPosition = string.IsNullOrWhiteSpace(user.UserPosition.Ident) ? user.UserPosition.Name : user.UserPosition.Ident,
                    Rate = user.User.UserDepartments.Count > 0 ? user.User.UserDepartments.Max(i => i.Rate) : 0,
                    Projects = new List<UserProjectPlanVm>(),
                    Weeks = weeks
                };

                foreach (var project in projects)
                {
                    var projectPlan = new UserProjectPlanVm
                    {
                        ProjectId = project.Id,
                        ProjectName = project.Name,
                        ProjectShortName = project.ShortName,
                        ProjectStart = project.Start,
                        ProjectEnd = project.End,
                        TaskTimes = new List<TaskTimeVm>(),
                        Plans = new List<UserProjectWeekPlanVm>()
                    };

                    // todo - this logic can be optimized
                    // all users have the same set of projects which means we can generate the list of TaskTimeVm only once and then populate it to each user
                    if (project.Tasks != null)
                    {
                        var taskTimes = project.Tasks
                            .Where(t => t.DepartmentEstimations.Any(de => de.Department.Id == dep.Id) &&
                             request.Start <= t.End && t.Start <= request.End)
                            .OrderBy(t => t.Start);
                        projectPlan.TaskTimes.AddRange(taskTimes.Select(i => new TaskTimeVm
                        {
                            Name = i.Description,
                            Start = i.Start,
                            End = i.End
                        }));
                    }

                    var weekIdx = 1;
                    foreach (var week in weeks)
                    {
                        var weekPlan = new UserProjectWeekPlanVm
                        {
                            WeekNumber = weekIdx,
                            WeekStart = week.Monday,
                            IsWeekAvailableForPlanning = projectPlan.TaskTimes.Any(i =>
                                i.Start <= week.Monday && i.End >= week.Monday ||
                                i.Start <= week.Monday.AddDays(1) && i.End >= week.Monday.AddDays(1) ||
                                i.Start <= week.Monday.AddDays(2) && i.End >= week.Monday.AddDays(2) ||
                                i.Start <= week.Monday.AddDays(3) && i.End >= week.Monday.AddDays(3) ||
                                i.Start <= week.Monday.AddDays(4) && i.End >= week.Monday.AddDays(4))
                        };

                        // get hours planned for the given user, project and week
                        var hours = plans.FirstOrDefault(
                            i => i.UserId == user.User.Id &&
                            i.ProjectId == project.Id &&
                            i.WeekStart == week.Monday)?.Hours ?? 0;

                        weekPlan.PlannedHours = hours;

                        projectPlan.Plans.Add(weekPlan);

                        weekIdx++;
                    }

                    //projectPlan.Plans = projectPlan.Plans.Where(p => p.PlannedHours > 0).ToList();
                    vm.Projects.Add(projectPlan);
                }

                res.Add(vm);
            }

            // show work plan only for users who works or who had quit but has some planned time
            res = res.Where(
                    u => users.First(j => j.UserId == u.UserId).User.WorksInTheCompany() ||
                    u.Projects.Any(p => p.Plans.Sum(i => i.PlannedHours) > 0)).ToList();

            return res.OrderBy(i => i.UserPosition).ToArray();
        }

        private static List<WeekInfoVm> BuildWeeks(UserDepartment user, DateTime start, DateTime end, Dictionary<DateTime, CalendarDayType> nonWorkingDays)
        {
            var res = new List<WeekInfoVm>();

            var dt = start;
            while (dt.DayOfWeek != DayOfWeek.Monday)
            {
                dt = dt.AddDays(1);
            }

            while (dt <= end)
            {
                var day = new WeekInfoVm
                {
                    Monday = dt,
                    HoursAvailableForPlanning = 40
                };

                if (nonWorkingDays.ContainsKey(dt))
                {
                    switch (nonWorkingDays[dt])
                    {
                        case CalendarDayType.Holiday: day.HoursAvailableForPlanning -= 8; break;
                        case CalendarDayType.HalfHoliday: day.HoursAvailableForPlanning -= 1; break;
                        default: break;
                    }
                }

                day.HoursAvailableForPlanning *= user.Rate;

                if (user.User.QuitDate is not null && dt >= user.User.QuitDate)
                {
                    day.HoursAvailableForPlanning = 0;
                }

                res.Add(day);
                dt = dt.AddDays(7);
            }

            return res;
        }
    }
}