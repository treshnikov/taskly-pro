using MediatR;

namespace Taskly.Application.Projects.Commands.AddNewTask;

public class AddNewTaskRequest : IRequest<ProjectTaskVm>
{
	public int ProjectId { get; set; }
}