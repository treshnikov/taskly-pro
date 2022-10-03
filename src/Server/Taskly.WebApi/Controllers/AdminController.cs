using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Serilog;
using Taskly.Application.Auth.Consts;
using Taskly.Application.Users;
using Taskly.WebApi.Models;

namespace Taskly.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/admin")]
    public class AdminController : BaseController
    {
        private readonly IOptions<IntranetDbConnectionSettings> _intranetDbConnectionSettings;

        public AdminController(IOptions<IntranetDbConnectionSettings> intranetDbConnectionSettings)
        {
            _intranetDbConnectionSettings = intranetDbConnectionSettings;
        }

        [HttpPost("import")]
        [Authorize(Roles = RoleIdents.Admin)]
        public async Task<ActionResult> ImportUsersAndDepartmentsAsync()
        {
            var request = new ImportDataFromJsonRequest(_intranetDbConnectionSettings.Value);
            await Mediator.Send(request);
            return Ok(new ImportResult());
        }
    }
}
