using Microsoft.AspNetCore.Mvc;
using Taskly.Application.Units.Queries;

namespace Taskly.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/units")]
    public class UnitsController : BaseController
    {
        [HttpGet]        
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Get()
        {
            var res = await Mediator.Send(new GetUnitUserssRequest());
            return Ok(res);
        }
    }
}
