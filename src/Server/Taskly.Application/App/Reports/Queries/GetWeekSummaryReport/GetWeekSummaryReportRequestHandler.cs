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
            Departments = new List<WeekSummaryReportDepartmentVm>()
        };

        var deps = await _dbContext.Departments
            .Where(d => d.IncludeInWorkPlan)
            .OrderBy(d => d.Name)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        foreach (var dep in deps)
        {
            var depVm = new WeekSummaryReportDepartmentVm
            {
                Name = dep.Name
            };

            res.Departments.Add(depVm);
        }

        return await Task.FromResult(res);
    }
}