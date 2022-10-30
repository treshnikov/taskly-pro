using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Taskly.Application.Auth.Consts;
using Taskly.Application.Users;
using Taskly.WebApi.Models;

namespace Taskly.WebApi.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin")]
public class AdminController : BaseController
{
	private readonly IntranetDbConnectionSettings _intranetDbConnectionSettings;

	public AdminController(IntranetDbConnectionSettings intranetDbConnectionSettings)
	{
		_intranetDbConnectionSettings = intranetDbConnectionSettings;
	}

	[HttpPost("importFromIntranet")]
	[Authorize(Roles = RoleIdents.Admin)]
	public async Task<ActionResult> ImportFromIntranetAsync()
	{
		var request = new ImportDataFromIntranetRequest(_intranetDbConnectionSettings);
		await Mediator.Send(request);
		return Ok(new ImportResult());
	}

	[HttpPost("importFromSharepoint")]
	[Authorize(Roles = RoleIdents.Admin)]
	public async Task<ActionResult> ImportFromSharepointAsync()
	{
		var request = new ImportDataFromSharepointRequest();
		await Mediator.Send(request);
		return Ok(new ImportResult());
	}
}
