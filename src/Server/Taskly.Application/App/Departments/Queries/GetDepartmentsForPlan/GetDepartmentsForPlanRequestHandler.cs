using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Departments.Queries.GetDepartmentsForPlan;

public class GetDepartmentsForPlanRequestHandler : IRequestHandler<GetDepartmentsForPlanRequest, DepartmentShortInfoVm[]>
{
	private readonly ITasklyDbContext _dbContext;
	public GetDepartmentsForPlanRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<DepartmentShortInfoVm[]> Handle(GetDepartmentsForPlanRequest request, CancellationToken cancellationToken)
	{
		return await _dbContext.Departments
			.AsNoTracking()
			.Where(i => i.IncludeInWorkPlan)
			.Select(i => new DepartmentShortInfoVm
			{
				Id = i.Id,
				Name = i.Name,
				ShortName = i.ShortName
			}).OrderBy(d => d.Name).ToArrayAsync(cancellationToken);
	}
}