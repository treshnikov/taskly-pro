namespace Taskly.Domain
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ShortName { get; set; }
        public virtual Department? Company { get; set; }
        public bool IsOpened { get; set; }
        public ProjectType Type { get; set; }
        public virtual User? ProjectManager { get; set; }
        public virtual User? ChiefEngineer {get;set;}
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime? CloseDate { get; set; }
        public virtual Customer Customer { get; set; }
        public string Contract { get; set; }
        public ICollection<ProjectTask> Tasks { get; set; }
    }
}