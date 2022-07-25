using MediatR;


namespace Taskly.Application.Users
{
    public class GetUserRequest : IRequest<UserVm>
    {
        public Guid UserId { get; set; }
    }
}
