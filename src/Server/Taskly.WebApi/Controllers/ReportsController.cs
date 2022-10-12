using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskly.Application.App.Reports;

namespace Taskly.WebApi.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/reports")]
[Authorize]
public class ReportsController : BaseController
{
    [HttpGet("week-summary/{monday}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> GetWeekSummary(DateTime monday)
    {
        var res = await Mediator.Send(new GetWeekSummaryReportRequest { Monday = monday });
        return Ok(res);
    }
}