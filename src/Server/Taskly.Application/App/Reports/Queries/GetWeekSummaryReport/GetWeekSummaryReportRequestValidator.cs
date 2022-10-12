using FluentValidation;

namespace Taskly.Application.App.Reports;

public class GetWeekSummaryReportRequestValidator : AbstractValidator<GetWeekSummaryReportRequest>
{
    public GetWeekSummaryReportRequestValidator()
    {
        RuleFor(i => i.Monday.DayOfWeek).Equal(DayOfWeek.Monday);
    }
}
