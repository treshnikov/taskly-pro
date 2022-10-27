namespace Taskly.Domain;

public class ProjectTaskEstimation
{
	public Guid Id { get; set; }
	public Department Department { get; set; }
	public ICollection<ProjectTaskUserPositionEstimation> Estimations { get; set; }

	// navigation
	public Guid ProjectTaskId { get; set; }
	public ProjectTask ProjectTask { get; set; }
}