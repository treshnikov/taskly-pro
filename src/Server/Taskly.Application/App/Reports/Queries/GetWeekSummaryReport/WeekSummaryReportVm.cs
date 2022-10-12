namespace Taskly.Application.App.Reports
{
    public class WeekSummaryReportVm
    {
        public List<WeekSummaryDepartmentVm> Departments { get; set; }
    }

    public class WeekSummaryDepartmentVm
    {
        public string Name { get; set; }
        public List<WeekSummaryUserVm> Users { get; set; }
    }

    public class WeekSummaryUserVm
    {
        public string Name { get; set; }
        public double Rate { get; set; }
        
    }
}