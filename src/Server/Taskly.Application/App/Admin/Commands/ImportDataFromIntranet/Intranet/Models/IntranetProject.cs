namespace Taskly.Application.Users;

public class IntranetProject
{
	public int Id { get; set; }
	public string ShortName { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public bool Opened { get; set; }
	public bool Internal { get; set; }
	public int DepartmentId { get; set; }
	public DateTime Start { get; set; }
	public DateTime End { get; set; }
	public DateTime? CloseDate { get; set; }
	public int? ManagerId { get; set; }
	public string? ManagerEmail { get; set; }
	public int? LeadEngineerId { get; set; }
	public string? LeadEngineerEmail { get; set; }
	public string CustomerName { get; set; } = string.Empty;
	public string? Contract { get; set; }
}