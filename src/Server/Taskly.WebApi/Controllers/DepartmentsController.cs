using Microsoft.AspNetCore.Mvc;
using Taskly.Application.Departments.Queries;
using Taskly.Application.Departments.Queries.GetDepartmentPlan;
using Taskly.Application.Departments.Queries.GetDepartmentsForPlan;
using Taskly.Application.Departments.UpdateDepartment;
using Taskly.WebApi.Models;

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
            var res = await Mediator.Send(new GetDepartmentUsersRequest { IncludeUsers = true });
            return Ok(res);
        }

        [HttpGet("withNoUsers")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetWithNoUsers()
        {
            var res = await Mediator.Send(new GetDepartmentUsersRequest { IncludeUsers = false });
            return Ok(res);
        }

        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpGet("forPlan")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetDepartmentsForPlan()
        {
            var res = await Mediator.Send(new GetDepartmentsForPlanRequest());
            return Ok(res);
        }

        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpGet("{id}/{start}/{end}/plan")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<DepartmentPlanRecordVm[]>> GetDepartmentPlan(Guid id, DateTime start, DateTime end)
        {
            var res = await Mediator.Send(new GetDepartmentPlanRequest
            {
                DepartmentId = id,
                Start = start,
                End = end
            });
            return Ok(res);
        }

        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("plan")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<string>> UpdatePlan([FromBody] UpdateDepartmentPlanVm arg)
        {
            return Ok(new Object());
        }

        [HttpPut("updateEnableForPlanning")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> UpdateEnableForPlanning([FromBody] DepartmentUpdateEnableForPlanningVm arg)
        {
            var res = await Mediator.Send(new UpdateDepartmnetIncludeInWorkPlanRequest { Id = arg.Id, IncludeInWorkPlan = arg.Value });
            return Ok(res);
        }
    }
}
