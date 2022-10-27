using MediatR;

namespace Taskly.Application.App.Reports;

public class GetWeekPlanReportRequest : IRequest<WeekPlanReportVm>
{
	public DateTime Monday { get; set; }
}
