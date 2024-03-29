﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskly.Application.Auth.Consts;
using Taskly.Application.Departments.Commands.UpdatePlans;
using Taskly.Application.Departments.Queries;
using Taskly.Application.Departments.Queries.GetDepartmentPlan;
using Taskly.Application.Departments.Queries.GetDepartmentsForPlan;
using Taskly.Application.Departments.Queries.GetDepartmentStatistics;
using Taskly.Application.Departments.UpdateDepartment;
using Taskly.WebApi.Models;

namespace Taskly.WebApi.Controllers;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/departments")]
[Authorize]
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

	[HttpGet("forPlan")]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status200OK)]
	public async Task<ActionResult> GetDepartmentsForPlan()
	{
		var res = await Mediator.Send(new GetDepartmentsForPlanRequest());
		return Ok(res);
	}

	[HttpGet("{id}/{start}/{end}/statistics")]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status200OK)]
	public async Task<ActionResult> GetDepartmentStatistics(Guid id, DateTime start, DateTime end)
	{
		var res = await Mediator.Send(new GetDepartmentStatisticsRequest
		{
			DepartmentId = id,
			Start = start,
			End = end
		});

		return Ok(res);
	}

	[HttpGet("{id}/{start}/{end}/plan")]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
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

	[HttpPost("plan")]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status200OK)]
	public async Task<ActionResult<string>> UpdatePlan([FromBody] UpdateDepartmentPlanVm arg)
	{
		await Mediator.Send(new UpdateDepartmentPlanRequest
		{
			DepartmentId = arg.DepartmentId,
			Data = arg.Data
		});

		return Ok(new object());
	}

	[HttpPut("updateEnableForPlanning")]
	[ProducesResponseType(StatusCodes.Status403Forbidden)]
	[ProducesResponseType(StatusCodes.Status200OK)]
	[Authorize(Roles = RoleIdents.Admin)]
	public async Task<ActionResult> UpdateEnableForPlanning([FromBody] DepartmentUpdateEnableForPlanningVm arg)
	{
		var res = await Mediator.Send(new UpdateDepartmnetIncludeInWorkPlanRequest { Id = arg.Id, IncludeInWorkPlan = arg.Value });
		return Ok(res);
	}
}
