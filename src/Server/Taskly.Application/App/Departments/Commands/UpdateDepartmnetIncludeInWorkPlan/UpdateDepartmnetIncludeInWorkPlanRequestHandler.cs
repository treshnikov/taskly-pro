using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Departments.UpdateDepartment;

public class UpdateDepartmnetIncludeInWorkPlanRequestHandler : IRequestHandler<UpdateDepartmnetIncludeInWorkPlanRequest, Unit>
{
	private readonly ITasklyDbContext _dbContext;
	public UpdateDepartmnetIncludeInWorkPlanRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}
	public async Task<Unit> Handle(UpdateDepartmnetIncludeInWorkPlanRequest request, CancellationToken cancellationToken)
	{
		var dep = await _dbContext.Departments.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);
		if (dep == null)
		{
			throw new NotFoundException($"Department with Id={request.Id} is not found.");
		}

		dep.IncludeInWorkPlan = request.IncludeInWorkPlan;
		await _dbContext.SaveChangesAsync(cancellationToken);

		return Unit.Value;

	}
}