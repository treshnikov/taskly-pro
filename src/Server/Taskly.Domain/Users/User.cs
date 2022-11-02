namespace Taskly.Domain;

public class User
{
	public Guid Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;
	public string? Email { get; set; }
	public DateTime HiringDate { get; set; }
	public DateTime? QuitDate { get; set; }
	public ICollection<Role> Roles { get; set; }
	public ICollection<UserDepartment> UserDepartments { get; set; }
}