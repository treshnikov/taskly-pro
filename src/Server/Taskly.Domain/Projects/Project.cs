namespace Taskly.Domain
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ShortName { get; set; }
        public virtual Unit? Company { get; set; }
        public Guid? UnitId { get; set; }
        public bool IsOpened { get; set; }
        public virtual User? ProjectManager { get; set; }
        public Guid? ProjectManagerId { get; set; }
        public virtual User? ChiefEngineer {get;set;}
        public Guid? ChiefEngineerId {get;set;}
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime? CloseDate { get; set; }
        public virtual Customer Customer { get; set; }
        public Guid CustomerId { get; set; }
        public string Contract { get; set; }
        public ICollection<ProjectTask> Tasks { get; set; }
    }
}