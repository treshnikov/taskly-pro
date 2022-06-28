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

            // handle all projects and tasks planned for given timerange for the department
            await HandleHoursInProjects(request, res, dep, cancellationToken);

            // handle estimations for departments
            // corner case when an estimation was set by the head of the department but the project doesn't contain a task for this estimation
            await HandleHoursPlannedByDepartment(request, res, dep, cancellationToken);

            // now we can calculate delta between project plan and department plan
            HandleDelta(res);

            return await Task.FromResult(res);
        }

        private static void HandleDelta(DepartmentStatisticsVm res)
        {
            foreach (var p in res.Projects)
            {
                p.DeltaHours = p.PlannedTaskHoursForDepartment - p.PlannedTaskHoursByDepartment;
            }
        }

        private async Task HandleHoursPlannedByDepartment(GetDepartmentStatisticsRequest request, DepartmentStatisticsVm res, Department dep, CancellationToken cancellationToken)
        {
            var departmentEstimations = _dbContext.DepartmentPlans
                .AsNoTracking()
                .Include(i => i.Project)
                .Where(i =>
                    i.DepartmentId == dep.Id &&
                    i.WeekStart >= request.Start && i.WeekStart <= request.End)
                .ToLookup(i => i.Project.Id, j => j.Hours);

            foreach (var projHours in departmentEstimations)
            {
                var projId = projHours.Key;
                float totalHours = 0;
                foreach (var hour in projHours)
                {
                    totalHours += hour;
                }

                var resProj = res.Projects.FirstOrDefault(i => i.Id == projId);
                if (resProj == null)
                {
                    var proj = await _dbContext.Projects.AsNoTracking().FirstAsync(i => i.Id == projId, cancellationToken);
                    resProj = new ProjectStatVm { Id = projId, Name = proj.ShortName, PlannedTaskHoursByDepartment = totalHours, PlannedTaskHoursForDepartment = 0 };
                    res.Projects.Add(resProj);
                }
                resProj.PlannedTaskHoursByDepartment = totalHours;
            }
        }

        private async Task HandleHoursInProjects(GetDepartmentStatisticsRequest request, DepartmentStatisticsVm res, Department dep, CancellationToken cancellationToken)
        {
            var tasks = await _dbContext.ProjectTasks
                .Include(i => i.Project)
                .Include(i => i.DepartmentEstimations).ThenInclude(i => i.Estimations)
                .Include(i => i.DepartmentEstimations).ThenInclude(i => i.Department)
                .AsNoTracking()
                .Where(t =>
                        request.Start < t.End && t.Start < request.End &&
                        t.DepartmentEstimations.Any(de => de.Department.Id == request.DepartmentId && de.Estimations.Sum(des => des.Hours) > 0)
                )
                .OrderBy(i => i.Id)
                .ToListAsync(cancellationToken);

            var tasksGroupedByProject = tasks.GroupBy(t => t.Project.ShortName);
            foreach (var taskGroup in tasksGroupedByProject)
            {
                var projShortName = taskGroup.Key;
                var projId = tasks.First(i => i.Project.ShortName == projShortName).ProjectId;
                var projStat = new ProjectStatVm
                {
                    Id = projId,
                    Name = projShortName,
                    PlannedTaskHoursByDepartment = 0,
                    PlannedTaskHoursForDepartment = 0,
                    DeltaHours = 0
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