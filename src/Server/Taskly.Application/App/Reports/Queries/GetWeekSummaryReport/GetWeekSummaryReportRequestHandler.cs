using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.App.Reports;

public class GetWeekSummaryReportRequestHandler : IRequestHandler<GetWeekSummaryReportRequest, WeekSummaryReportVm>
{
    private readonly ITasklyDbContext _dbContext;

    public GetWeekSummaryReportRequestHandler(ITasklyDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<WeekSummaryReportVm> Handle(GetWeekSummaryReportRequest request, CancellationToken cancellationToken)
    {
        var res = new WeekSummaryReportVm
        {
            Departments = new List<WeekSummaryDepartmentVm>()
        };

        var deps = await _dbContext.Departments
            .Where(d => d.IncludeInWorkPlan)
            .OrderBy(d => d.Name)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        foreach (var dep in deps)
        {
            var depUsers = await _dbContext.Users
                .Include(i => i.UserDepartments)
                .Where(u =>
                    // todo extract logic to a specification
                    u.HiringDate <= request.Monday &&
                    (u.QuitDate == null || u.QuitDate > request.Monday.AddDays(5)) &&
                    u.UserDepartments.Any(ud => ud.DepartmentId == dep.Id && ud.Rate > 0.1))
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            var userIds = depUsers.Select(i => i.Id).ToList();

            var userPlans = await _dbContext.DepartmentPlans
                .Include(i => i.ProjectTask)
                    .ThenInclude(i => i.Project)
                .Where(p => p.WeekStart == request.Monday && userIds.Contains(p.UserId))
                .OrderBy(p => p.ProjectTask.Project.Id).ThenByDescending(p => p.Hours)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var depVm = new WeekSummaryDepartmentVm
            {
                Name = dep.Name,
                Users = new List<WeekSummaryUserVm>()
            };

            foreach (var user in depUsers)
            {
                var userVm = new WeekSummaryUserVm
                {
                    Name = user.Name,
                    Rate = user.UserDepartments.Select(ud => ud.Rate).Max(),
                    Plans = new List<WeekSummaryPlanVm>()
                };

                foreach (var p in userPlans.Where(u => u.UserId == user.Id))
                {
                    userVm.Plans.Add(new WeekSummaryPlanVm
                    {
                        TaskName = $"{p.ProjectTask.Project.Id}: {p.ProjectTask.Project.ShortName} - {p.ProjectTask.Description}",
                        Hours = p.Hours,
                        TaskStart = p.ProjectTask.Start,
                        TaskEnd = p.ProjectTask.End,
                        TaskIsOutdated = !(request.Monday >= p.ProjectTask.Start && request.Monday <= p.ProjectTask.End)
                    });
                }

                depVm.Users.Add(userVm);
            }
            res.Departments.Add(depVm);
        }

        return await Task.FromResult(res);
    }
}