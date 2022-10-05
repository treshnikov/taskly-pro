namespace Taskly.Domain
{
    public class DepartmentPlan
    {
        public Guid Id { get; set; }
        public double Hours { get; set; }
        public DateTime WeekStart { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid DepartmentId { get; set; }
        public virtual Department Department { get; set; }
        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
    }
}