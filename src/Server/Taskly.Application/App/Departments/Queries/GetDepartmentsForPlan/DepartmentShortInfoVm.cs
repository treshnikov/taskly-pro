namespace Taskly.Application.Departments.Queries.GetDepartmentsForPlan;

public class DepartmentShortInfoVm
{
	public Guid Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string ShortName { get; internal set; } = string.Empty;
}