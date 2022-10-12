using MediatR;

namespace Taskly.Application.App.Reports;

public class GetWeekSummaryReportRequest : IRequest<WeekSummaryReportVm>
{
    public DateTime Monday { get; set; }
}
