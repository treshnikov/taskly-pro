namespace Taskly.Application.App.Reports
{
    public class WeekPlanReportVm
    {
        public List<WeekPlanDepartmentVm> Departments { get; set; }
    }

    public class WeekPlanDepartmentVm
    {
        public string Name { get; set; }
        public List<WeekPlanUserVm> Users { get; set; }
    }

    public class WeekPlanUserVm
    {
        public string Name { get; set; }
        public double Rate { get; set; }
        public List<WeekPlanVm> Plans { get; set; }
    }

    public class WeekPlanVm
    {
        public int ProjectId { get; internal set; }
        public string? ProjectName { get; internal set; }
        public string TaskName { get; set; }
        public double Hours { get; set; }
        public DateTime TaskStart { get; set; }
        public DateTime TaskEnd { get; set; }
        public bool TaskIsOutdated { get; set; }
    }
}