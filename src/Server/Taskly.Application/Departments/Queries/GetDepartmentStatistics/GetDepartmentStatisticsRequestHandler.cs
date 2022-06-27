using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;

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
                    Id = tasks.First(i => i.Project.ShortName == proj).ProjectId,
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
                            projStat.PlannedTaskHoursForDepartment += (int)CalculateAvailableTime(task, request, e.Hours);
                        }
                    }
                }

                res.Projects.Add(projStat);
            }

            return await Task.FromResult(res);
        }

        private static double CalculateAvailableTime(ProjectTask t, GetDepartmentStatisticsRequest r, int hours)
        {
            /*
                # case 1 - available time equals task to request time 
                task                        ts|-------------------|te
                request                             rs|-----|re
            */
            if (t.Start <= r.Start && t.End >= r.End)
            {
                return hours * ((r.End - r.Start).TotalHours / (t.End - t.Start).TotalHours);
            }

            /*
                # case 2 - available time equals to task time
                task                       			     ts|-------|te
                request                             rs|-----------------|re
            */
            if (t.Start >= r.Start && t.End <= r.End)
            {
                return hours;
            }

            /*
                # case 3 - available time equals a time segment from request start to task end
                task                       	   ts|-------|te
                request                             rs|-----------------|re
            */
            if (r.Start >= t.Start && r.Start <= t.End)
            {
                return hours * ((t.End - r.Start).TotalHours / (t.End - t.Start).TotalHours);
            }

            /*
                # case 4 - available time equals a time segment from task start to request end
                task                       	   					  ts|-------|te
                request                             rs|-----------------|re
            
            */
            if (t.Start >= r.Start && t.Start <= r.End)
            {
                return hours * ((r.End - t.Start).TotalHours / (t.End - t.Start).TotalHours);
            }

            throw new Exception($"The app cannot handle time periods overlap {r.Start} - {r.End} / {t.Start} - {t.End}.");

        }
    }
}