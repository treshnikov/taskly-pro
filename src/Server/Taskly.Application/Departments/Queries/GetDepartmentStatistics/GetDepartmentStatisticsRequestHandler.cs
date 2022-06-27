using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Departments.Queries.GetDepartmentStatistics
{
    public class GetDepartmentStatisticsRequestHandler : IRequestHandler<GetDepartmentStatisticsRequest, DepartmentStatisticsVm>
    {
        private readonly ITasklyDbContext _dbContext;

        public GetDepartmentStatisticsRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<DepartmentStatisticsVm> Handle(GetDepartmentStatisticsRequest request, CancellationToken cancellationToken)
        {
            var res = new DepartmentStatisticsVm
            {
                Projects = new List<ProjectStatVm>()
            };

            // get department by id
            var dep = await _dbContext.Departments
                .Include(d => d.UserDepartments).ThenInclude(d => d.UserPosition)
                .Include(d => d.UserDepartments).ThenInclude(d => d.User)
                .AsNoTracking()
                .FirstAsync(i => i.Id == request.DepartmentId, cancellationToken);

            // get all tasks planned for given timerange for the department
            var tasks = await _dbContext.ProjectTasks
                .Include(i => i.Project)
                .Include(i => i.DepartmentEstimations).ThenInclude(i => i.Estimations)
                .Include(i => i.DepartmentEstimations).ThenInclude(i => i.Department)
                .AsNoTracking()
                .Where(t =>
                        request.Start < t.End && t.Start < request.End &&
                        t.DepartmentEstimations.Any(de => de.Department.Id == request.DepartmentId && de.Estimations.Sum(des => des.Hours) > 0)
                )
                .ToListAsync(cancellationToken);

            var tasksGroupedByProject = tasks.GroupBy(t => t.Project.ShortName);
            foreach (var taskGroup in tasksGroupedByProject)
            {
                var proj = taskGroup.Key;
                var projStat = new ProjectStatVm
                {
                    Id = 0,
                    Name = proj,
                    PlannedTaskHoursByDepartment = 0,
                    PlannedTaskHoursForDepartment = 0
                };

                foreach (var task in taskGroup)
                {
                    foreach (var de in task.DepartmentEstimations.Where(d => d.Department.Id == dep.Id))
                    {
                        foreach (var e in de.Estimations)
                        {
                            projStat.PlannedTaskHoursForDepartment += e.Hours;
                        }
                    }
                }

                res.Projects.Add(projStat);
            }

            return await Task.FromResult(res);
        }
    }
}