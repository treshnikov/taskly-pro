using MediatR;

namespace Taskly.Application.Projects
{
    public class GetProjectsShortInfoRequest : IRequest<ProjectShortInfoVm[]>
    {

    }
}