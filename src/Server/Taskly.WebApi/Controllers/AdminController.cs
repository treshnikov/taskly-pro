using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Taskly.Application.Users;

namespace Taskly.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/admin")]
    public class AdminController : BaseController
    {
        /// <summary>
        /// Finds departments.json, users.json and project.json files in the execution directory and tries to update the DB
        /// </summary>
        /// <returns></returns>
        [HttpPost("import")]
        [Authorize]
        public async Task<ActionResult> ImportUsersAndDepartmentsAsync()
        {
            var request = new ImportDataFromJsonRequest();
            await Mediator.Send(request);
            return Ok(new {msg = "Ok"});
        }
    }
}
