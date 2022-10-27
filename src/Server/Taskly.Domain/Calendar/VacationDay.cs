namespace Taskly.Domain;

public class VacationDay
{
	public Guid Id { get; set; }
	public CalendarDayType DayType { get; set; }
	public Guid UserId { get; set; }
	public User? User { get; set; }
	public DateTime Date { get; set; }
}