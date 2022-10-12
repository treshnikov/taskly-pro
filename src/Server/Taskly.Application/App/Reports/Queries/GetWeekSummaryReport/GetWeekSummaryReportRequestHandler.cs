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
                    u.HiringDate <= request.Monday &&
                    (u.QuitDate == null || u.QuitDate > request.Monday.AddDays(5)) &&
                    u.UserDepartments.Any(ud => ud.DepartmentId == dep.Id && ud.Rate > 0.1))
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            var depVm = new WeekSummaryDepartmentVm
            {
                Name = dep.Name,
                Users = new List<WeekSummaryUserVm>()
            };

            foreach (var user in depUsers)
            {
                var userVm = new WeekSummaryUserVm{
                    Name = user.Name,
                    Rate = user.UserDepartments.Select(ud => ud.Rate).Max()
                };

                depVm.Users.Add(userVm);
            }
            res.Departments.Add(depVm);
        }

        return await Task.FromResult(res);
    }
}