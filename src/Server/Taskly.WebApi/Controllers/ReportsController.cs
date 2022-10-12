using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskly.Application.App.Reports;

namespace Taskly.WebApi.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/reports")]
[Authorize]
public class ReportsController : BaseController
{
    [HttpGet("week-plan/{monday}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> GetWeekPlan(DateTime monday)
    {
        var res = await Mediator.Send(new GetWeekPlanReportRequest { Monday = monday });
        return Ok(res);
    }
}