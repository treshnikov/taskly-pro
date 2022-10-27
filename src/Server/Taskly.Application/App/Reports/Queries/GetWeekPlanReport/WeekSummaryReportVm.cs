namespace Taskly.Application.App.Reports;

public class WeekPlanReportVm
{
	public List<WeekPlanDepartmentVm> Departments { get; set; } = new List<WeekPlanDepartmentVm>();
}

public class WeekPlanDepartmentVm
{
	public string Name { get; set; } = string.Empty;
	public List<WeekPlanUserVm> Users { get; set; } = new List<WeekPlanUserVm>();
}

public class WeekPlanUserVm
{
	public string Name { get; set; } = string.Empty;
	public double Rate { get; set; }
	public List<WeekPlanVm> Plans { get; set; } = new List<WeekPlanVm>();
}

public class WeekPlanVm
{
	public int? ProjectId { get; internal set; }
	public string? ProjectName { get; internal set; }
	public string TaskName { get; set; } = string.Empty;
	public double Hours { get; set; }
	public DateTime TaskStart { get; set; }
	public DateTime TaskEnd { get; set; }
	public bool TaskIsOutdated { get; set; }
	public bool IsVacation { get; set; }
}