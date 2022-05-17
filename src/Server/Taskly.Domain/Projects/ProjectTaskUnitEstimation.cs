namespace Taskly.Domain
{
    public class ProjectTaskUnitEstimation
    {
        public Guid Id { get; set; }
        public Unit Unit { get; set; }
        public ICollection<ProjectTaskUnitEstimationToUserPosition> Estimations { get; set; }

        // navigation
        public Guid ProjectTaskId { get; set; }
        public ProjectTask ProjectTask { get; set; }    
    }
}