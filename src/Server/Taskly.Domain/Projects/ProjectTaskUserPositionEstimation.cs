namespace Taskly.Domain;

public class ProjectTaskUserPositionEstimation
{
	public Guid Id { get; set; }

	public int Hours { get; set; }

	public UserPosition UserPosition { get; set; }

	// navigation
	public Guid ProjectTaskDepartmentEstimationId { get; set; }
	public ProjectTaskEstimation ProjectTaskDepartmentEstimation { get; set; }
}