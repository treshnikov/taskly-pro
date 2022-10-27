using FluentValidation;

namespace Taskly.Application.App.Reports;

public class GetWeekPlanReportRequestValidator : AbstractValidator<GetWeekPlanReportRequest>
{
	public GetWeekPlanReportRequestValidator()
	{
		RuleFor(i => i.Monday.DayOfWeek).Equal(DayOfWeek.Monday);
	}
}
