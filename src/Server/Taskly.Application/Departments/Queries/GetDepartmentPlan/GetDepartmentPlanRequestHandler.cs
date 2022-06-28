using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

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

            // build a list of weeks according to start and end dates            
            DateTime[] weeks = BuildWeeks(request.Start, request.End);

            // compose view model
            foreach (var user in users)
            {
                var vm = new DepartmentPlanRecordVm
                {
                    UserId = user.User.Id,
                    UserName = user.User.Name,
                    UserPosition = string.IsNullOrWhiteSpace(user.UserPosition.Ident) ? user.UserPosition.Name : user.UserPosition.Ident,
                    Rate = user.User.UserDepartments.Count > 0 ? user.User.UserDepartments.Max(i => i.Rate) : 0,
                    Projects = new List<UserProjectPlanVm>()
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
                    foreach (var weekStartDate in weeks)
                    {
                        var weekPlan = new UserProjectWeekPlanVm
                        {
                            WeekNumber = weekIdx,
                            WeekStart = weekStartDate,
                            IsWeekAvailableForPlanning = projectPlan.TaskTimes.Any(i =>
                                i.Start <= weekStartDate && i.End >= weekStartDate ||
                                i.Start <= weekStartDate.AddDays(1) && i.End >= weekStartDate.AddDays(1) ||
                                i.Start <= weekStartDate.AddDays(2) && i.End >= weekStartDate.AddDays(2) ||
                                i.Start <= weekStartDate.AddDays(3) && i.End >= weekStartDate.AddDays(3) ||
                                i.Start <= weekStartDate.AddDays(4) && i.End >= weekStartDate.AddDays(4))
                        };

                        // get hours planned for the given user, project and week
                        var hours = plans.FirstOrDefault(
                            i => i.UserId == user.User.Id &&
                            i.ProjectId == project.Id &&
                            i.WeekStart == weekStartDate)?.Hours ?? 0;

                        weekPlan.PlannedHours = hours;
                        projectPlan.Plans.Add(weekPlan);

                        weekIdx++;
                    }

                    //projectPlan.Plans = projectPlan.Plans.Where(p => p.PlannedHours > 0).ToList();
                    vm.Projects.Add(projectPlan);
                }

                res.Add(vm);
            }
            return res.OrderBy(i => i.UserPosition).ToArray();
        }

        private DateTime[] BuildWeeks(DateTime start, DateTime end)
        {
            var res = new List<DateTime>();

            var dt = start;
            while (dt.DayOfWeek != DayOfWeek.Monday)
            {
                dt = dt.AddDays(1);
            }

            while (dt <= end)
            {
                res.Add(dt);
                dt = dt.AddDays(7);
            }

            return res.ToArray();
        }
    }
}