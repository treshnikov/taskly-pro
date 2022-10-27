using MediatR;

namespace Taskly.Application.Projects;

public class GetProjectsDetailedInfoRequest : IRequest<ProjectDetailedInfoVm>
{
	public int ProjectId { get; set; }
}