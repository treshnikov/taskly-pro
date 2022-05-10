namespace Taskly.Domain
{
    public class ProjectTask
    {
        public Guid Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Description { get; set; }
        public ICollection<ProjectTaskUnitEstimation> Estimations { get; set; }
    }
}