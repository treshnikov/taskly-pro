using MediatR;

namespace Taskly.Application.Projects.Commands.UpdateTasks
{
    public class UpdateTasksRequest : IRequest<Unit>
    {
        public int ProjectId { get; set; }
        public ProjectTaskVm[] Tasks { get; set; }
    }
}