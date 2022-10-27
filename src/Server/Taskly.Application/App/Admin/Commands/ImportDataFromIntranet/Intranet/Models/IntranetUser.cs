namespace Taskly.Application.Users;

public class IntranetUser
{
	public int Id { get; set; }
	public string FirstName { get; set; } = string.Empty;
	public string MiddleName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public string Email { get; set; } = string.Empty;
	public int DepartmentId { get; set; }
	public string Title { get; set; } = string.Empty;
	public double TimeRate { get; set; }
	public DateTime? QuitDate { get; set; }
	public DateTime HiringDate { get; set; }
}