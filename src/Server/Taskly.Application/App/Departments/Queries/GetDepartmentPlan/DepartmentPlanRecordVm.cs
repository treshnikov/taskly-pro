using Taskly.Application.Calendar;

namespace Taskly.Application.Departments.Queries.GetDepartmentPlan;

public class DepartmentPlanRecordVm
{
	public Guid UserId { get; set; }
	public string UserName { get; set; } = string.Empty;
	public string UserPosition { get; set; } = string.Empty;
	public double Rate { get; set; }
	public DateTime? QuitDate { get; set; }
	public DateTime HiringDate { get; set; }
	public List<TaskPlanVm> Tasks { get; set; } = new List<TaskPlanVm>();
	public IEnumerable<WeekInfo> Weeks { get; set; } = new List<WeekInfo>();
}

public class TaskPlanVm
{
	public int ProjectId { get; set; }
	public Guid ProjectTaskId { get; set; }
	public string ProjectName { get; set; } = string.Empty;
	public string ProjectShortName { get; set; } = string.Empty;
	public string TaskName { get; set; } = string.Empty;
	public DateTime TaskStart { get; internal set; }
	public DateTime TaskEnd { get; internal set; }
	public List<UserProjectWeekPlanVm> Plans { get; set; } = new List<UserProjectWeekPlanVm>();
}

public class UserProjectWeekPlanVm
{
	public int WeekNumber { get; internal set; }
	public DateTime WeekStart { get; set; }
	public double PlannedHours { get; set; }
	public bool IsWeekAvailableForPlanning { get; set; }
}