namespace Taskly.Domain
{
    public class ProjectTask
    {
        public Guid Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Description { get; set; }
        public string? Comment { get; set; }
        public ICollection<ProjectTaskDepartmentEstimation> DepartmentEstimations { get; set; }

        // navigation
        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}