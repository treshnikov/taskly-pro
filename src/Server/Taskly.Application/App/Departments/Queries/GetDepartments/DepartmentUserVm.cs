namespace Taskly.Application.Departments.Queries;

public enum DepartmentUserType
{
	Root = 1000,
	Department = 0,
	User = 1
}

public class DepartmentUserVm
{
	public Guid Id { get; set; }
	public string? Name { get; set; }
	public bool IncludeInWorkPlan { get; set; }
	public DepartmentUserType Type { get; set; }
	public List<DepartmentUserVm>? Children { get; set; }
}