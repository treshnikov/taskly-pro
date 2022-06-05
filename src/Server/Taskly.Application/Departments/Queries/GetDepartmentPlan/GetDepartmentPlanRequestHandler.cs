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
                    p => p.Tasks.Any(
                        t =>
                            request.Start <= t.Start && request.End >= t.Start && 
                            t.DepartmentEstimations.Any(
                            de => de.Department.Id == request.DepartmentId && de.Estimations.Sum(des => des.Hours) > 0)))
                .ToListAsync(cancellationToken);

            // or projects that have been planned before for the given department
            // todo

            // build a list of weeks according to start and end dates            
            DateTime[] weeks = BuildWeeks(request.Start, request.End);

            // laod plans for each employee for each week for each project
            // todo

            // compose view model
            foreach (var user in users)
            {
                var vm = new DepartmentPlanRecordVm
                {
                    UserId = user.Id,
                    UserName = user.User.Name,
                    UserPosition = user.UserPosition.Name,
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
                        Plans = new List<UserProjectWeekPlanVm>()
                    };

                    foreach (var week in weeks)
                    {
                        var weekPlan = new UserProjectWeekPlanVm
                        {
                            WeekStart = week
                        };

                        // get hours planned for the given user, project and week
                        // todo
                        var hours = 0;

                        weekPlan.PlannedHours = hours;
                        projectPlan.Plans.Add(weekPlan);
                    }

                    vm.Projects.Add(projectPlan);
                }

                res.Add(vm);
            }

            return res.ToArray();
        }

        private DateTime[] BuildWeeks(DateTime start, DateTime end)
        {
            var res = new List<DateTime>();

            var dt = start;
            while (dt.DayOfWeek != DayOfWeek.Monday)
            {
                dt = dt.AddDays(-1);
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