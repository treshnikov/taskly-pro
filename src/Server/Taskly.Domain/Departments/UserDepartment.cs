namespace Taskly.Domain
{
    public class UserDepartment
    {
        public Guid Id { get; set; }
        public double Rate { get; set; }
        public Guid UserId { get; set; }
        public Guid DepartmentId { get; set; }
        public Guid UserPositionId { get; set; }
        public virtual Department Department { get; set; }
        public virtual User User { get; set; }
        public UserPosition UserPosition { get; set; }
    }
}