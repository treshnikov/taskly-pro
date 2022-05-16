namespace Taskly.Domain
{
    public class ProjectTaskUnitEstimationToUserPosition
    {
        public Guid Id { get; set; }

        public int Hours { get; set; }

        public Guid ProjectTaskUnitEstimationID { get; set; }
        public ProjectTaskUnitEstimation ProjectTaskUnitEstimation { get; set; }
       
        public Guid UserPositionId { get; set; }
        public UserPosition UserPosition { get; set; }
    }
}