namespace Taskly.Application.App.Reports
{
    public class WeekSummaryReportVm
    {
        public List<WeekSummaryReportDepartmentVm> Departments { get; set; }
    }

    public class WeekSummaryReportDepartmentVm
    {
        public string Name { get; set; }
    }
}