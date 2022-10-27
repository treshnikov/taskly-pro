namespace Taskly.Application.Users;

public class SharepointUserPlan
{
	public string UserName { get; set; } = string.Empty;
	public double Rate { get; set; }
	public List<SharepointWeekPlan> Weeks { get; set; } = new List<SharepointWeekPlan>();
}