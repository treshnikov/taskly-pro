namespace Taskly.Application.Users
{
    public class SharepointUserPlan
    {
        public string UserName { get; set; }
        public double Rate { get; set; }
        public List<SharepointWeekPlan> Weeks { get; set; }
    }

}