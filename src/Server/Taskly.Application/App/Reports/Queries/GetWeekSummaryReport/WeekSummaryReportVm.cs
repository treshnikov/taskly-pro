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
        public List<WeekSummaryPlanVm> Plans { get; set; }
    }

    public class WeekSummaryPlanVm
    {
        public string TaskName { get; set; }
        public double Hours { get; set; }
        public DateTime TaskStart { get; set; }
        public DateTime TaskEnd { get; set; }
        public bool TaskIsOutdated { get; set; }
    }
}