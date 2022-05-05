using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Taskly.Application.Auth.Commands.Register;
using Taskly.Application.Auth.Consts;
using Taskly.Application.Auth.Queries.GetUsers;
using Taskly.Application.Jwt;
using Taskly.Domain;

namespace Taskly.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/auth")]
    public class AuthenticationController : BaseController
    {
        /// <summary>
        /// Name of the Cookies attribute in which the server saves jwt when handling a login request.
        /// This attribute is also examined during handling a request from a client, the server tries to get jwt from Cookies.
        /// So this means jwt can be gotten either from Cookies or the "Authentication: Beare ..." header.
        /// </summary>
        public static string JwtCookiesKey = "jwt";

        [HttpPost("token")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Token([FromForm] GetJwtTokenRequest request)
        {
            var res = await Mediator.Send(request);

            return Ok(new {jwt = res});
        }
        
        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Login([FromForm] GetJwtTokenRequest request)
        {
            var jwt = await Mediator.Send(request);
            Response.Cookies.Append(JwtCookiesKey, jwt, new CookieOptions
            {
                HttpOnly = true
            });

            return Ok();
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Logout()
        {
            Response.Cookies.Delete(JwtCookiesKey);

            return Ok();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<Guid>> RegisterNewUser([FromForm] RegisterNewUserRequest user)
        {
            var result = await Mediator.Send(user);

            return Ok(result);
        }

        [HttpGet("users")]        
        //[Authorize(Roles = RoleIdents.Admin)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetUsers()
        {
            Log.Warning($"User[{UserId}] requests user list.");
            
            var res = await Mediator.Send(new GetUsersRequest());
            return Ok(res);
        }

        [HttpGet("user")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetUser()
        {
            var res = await Mediator.Send(new GetUserRequest{UserId = UserId});
            return Ok(res);
        }

        

    }
}
