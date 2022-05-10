namespace Taskly.Domain
{
    public class UserUnit
    {
        public Guid Id { get; set; }
        public string UserTitle { get; set; }
        public double Rate { get; set; }
        public string Comment { get; set; }
        
        public Guid UserId { get; set; }
        public Guid UnitId { get; set; }
        public virtual Unit Unit { get; set; }
        public virtual User User { get; set; }  
    }

}