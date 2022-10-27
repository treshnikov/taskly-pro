using MediatR;

namespace Taskly.Application.Projects.Commands.DeleteTask;

public class DeleteTaskRequest : IRequest<Unit>
{
	public Guid TaskId { get; set; }
}