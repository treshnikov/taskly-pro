namespace Taskly.Domain
{
    public class ProjectTaskDepartmentEstimationToUserPosition
    {
        public Guid Id { get; set; }

        public int Hours { get; set; }
       
        public UserPosition UserPosition { get; set; }

        // navigation
        public Guid ProjectTaskDepartmentEstimationId { get; set; }
        public ProjectTaskDepartmentEstimation ProjectTaskDepartmentEstimation { get; set; }
    }
}