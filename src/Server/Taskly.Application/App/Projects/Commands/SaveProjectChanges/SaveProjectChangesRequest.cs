using MediatR;

namespace Taskly.Application.Projects.Commands.UpdateTasks;

public class SaveProjectChangesRequest : IRequest<Unit>
{
	public int ProjectId { get; set; }
	public ProjectTaskVm[] Tasks { get; set; } = Array.Empty<ProjectTaskVm>();
}