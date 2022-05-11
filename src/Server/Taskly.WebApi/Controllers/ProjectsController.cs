using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Taskly.Application.Projects;
using Taskly.Application.Users;

namespace Taskly.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/projects")]
    public class ProjectsController : BaseController
    {
        [HttpGet]        
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetProjects()
        {            
            var res = await Mediator.Send(new GetProjectsShortInfoRequest());
            return Ok(res);
        }
    }
}
