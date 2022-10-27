namespace Taskly.Application.Users;

public class IntranetUserVacation
{
	public DateTime Date { get; set; }
	public string Email { get; set; } = string.Empty;
	public bool IsMaternityLeave { get; set; }
}