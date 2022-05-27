using Microsoft.AspNetCore.Mvc;
using Taskly.Application.Departments.Queries;

namespace Taskly.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/departments")]
    public class DepartmentsController : BaseController
    {
        [HttpGet]        
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Get()
        {
            var res = await Mediator.Send(new GetDepartmentUsersRequest());
            return Ok(res);
        }
    }
}
