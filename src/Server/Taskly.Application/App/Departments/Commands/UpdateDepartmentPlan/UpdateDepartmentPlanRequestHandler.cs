using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Departments.Commands.UpdatePlans;

public class UpdateDepartmentPlanRequestHandler : IRequestHandler<UpdateDepartmentPlanRequest, Unit>
{
	private readonly ITasklyDbContext _dbContext;

	public UpdateDepartmentPlanRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<Unit> Handle(UpdateDepartmentPlanRequest request, CancellationToken cancellationToken)
	{
		using var transaction = _dbContext.Database.BeginTransaction();

		var dep = await _dbContext.Departments.FirstAsync(i => i.Id == request.DepartmentId, cancellationToken);
		await RemoveDepartmentPlansAsync(dep, request, cancellationToken);

		foreach (var usr in request.Data)
		{
			foreach (var proj in usr.Tasks)
			{
				foreach (var week in proj.Plans)
				{
					var dp = new DepartmentPlan
					{
						DepartmentId = dep.Id,
						UserId = usr.UserId,
						ProjectTaskId = proj.ProjectTaskId,
						WeekStart = week.WeekStart,
						Hours = week.PlannedHours
					};

					await _dbContext.DepartmentPlans.AddAsync(dp, cancellationToken);
				}
			}
		}
		await _dbContext.SaveChangesAsync(cancellationToken);
		transaction.Commit();

		return await Task.FromResult(Unit.Value);
	}

	private async Task RemoveDepartmentPlansAsync(Department dep, UpdateDepartmentPlanRequest request, CancellationToken cancellationToken)
	{
		var weeks = request.Data.SelectMany(i => i.Tasks).SelectMany(i => i.Plans).Select(i => i.WeekStart).Distinct();
		var deleteFromDate = weeks.Min();
		var deleteToDate = weeks.Max();

		var plan = _dbContext
			.DepartmentPlans
			.Where(i => i.DepartmentId == dep.Id)
			.Where(i => i.WeekStart >= deleteFromDate && i.WeekStart <= deleteToDate);

		foreach (var item in plan)
		{
			_dbContext.DepartmentPlans.Remove(item);
		}

		await _dbContext.SaveChangesAsync(cancellationToken);
	}
}