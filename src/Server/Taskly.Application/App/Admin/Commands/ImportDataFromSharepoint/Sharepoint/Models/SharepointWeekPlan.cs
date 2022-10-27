namespace Taskly.Application.Users;

public class SharepointWeekPlan
{
	public DateTime WeekStart { get; set; }
	public List<SharepointProjectPlan> Projects { get; set; } = new List<SharepointProjectPlan>();
}