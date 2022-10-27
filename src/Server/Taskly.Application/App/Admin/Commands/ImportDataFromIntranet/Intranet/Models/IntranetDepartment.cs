namespace Taskly.Application.Users;

public class IntranetDepartment
{
	public int Id { get; set; }
	public int? ParentId { get; set; }
	public string Name { get; set; } = string.Empty;
	public string ShortName { get; set; } = string.Empty;
	public int OrderNumber { get; set; }
}