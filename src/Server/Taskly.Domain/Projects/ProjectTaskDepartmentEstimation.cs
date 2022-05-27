namespace Taskly.Domain
{
    public class ProjectTaskDepartmentEstimation
    {
        public Guid Id { get; set; }
        public Department Department { get; set; }
        public ICollection<ProjectTaskDepartmentEstimationToUserPosition> Estimations { get; set; }

        // navigation
        public Guid ProjectTaskId { get; set; }
        public ProjectTask ProjectTask { get; set; }    
    }
}