using MediatR;

namespace Taskly.Application.Users;

public class GetUsersRequest : IRequest<IEnumerable<UserVm>>
{
}
