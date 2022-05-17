namespace Taskly.Domain
{
    public class ProjectTaskUnitEstimationToUserPosition
    {
        public Guid Id { get; set; }

        public int Hours { get; set; }
       
        public UserPosition UserPosition { get; set; }

        // navigation
        public Guid ProjectTaskUnitEstimationId { get; set; }
        public ProjectTaskUnitEstimation ProjectTaskUnitEstimation { get; set; }
    }
}