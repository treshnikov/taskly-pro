using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Taskly.WebApi.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class BaseController : ControllerBase
{
	protected IMediator Mediator => HttpContext.RequestServices.GetService<IMediator>() ?? throw new ArgumentException(nameof(Mediator));

	internal Guid UserId => !(User.Identity?.IsAuthenticated ?? false)
		? Guid.Empty
		: Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception($"Cannot find a {nameof(ClaimTypes.NameIdentifier)} in the user claims."));

}
