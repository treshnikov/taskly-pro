namespace Taskly.Domain
{
    public class ProjectTaskUnitEstimation
    {
        public Guid Id { get; set; }
        public Unit Unit { get; set; }
        public Guid UnitId { get; set; }
        public ICollection<ProjectTaskUnitEstimationToUserPosition> Estimations { get; set; }
    }
}