using MediatR;

namespace Taskly.WebApi.Controllers;

public class GetJwtTokenRequest : IRequest<string>
{
	public string Email { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;
}
