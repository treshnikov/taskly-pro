using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Taskly.Application.Users;

namespace Taskly.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/users")]
    [Authorize]
    public class UserController : BaseController
    {
        [HttpGet]
        //[Authorize(Roles = RoleIdents.Admin)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetUsers()
        {
            var res = await Mediator.Send(new GetUsersRequest());
            return Ok(res);
        }

        [HttpGet("user")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetUser()
        {
            var res = await Mediator.Send(new GetUserRequest { UserId = UserId });
            return Ok(res);
        }
    }
}
