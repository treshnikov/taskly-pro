using MediatR;

namespace Taskly.Application.Projects.Queries
{
    public class GetDefaultTaskEstimationsRequest : IRequest<ProjectTaskUnitEstimationVm[]>
    {

    }

}