using MediatR;

namespace Taskly.Application.Auth.Commands.Register;

public class RegisterNewUserRequest : IRequest<Guid>
{
	public string Name { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;
	public string Email { get; set; } = string.Empty;
}
