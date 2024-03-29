using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Projects.Queries;

public class GetDefaultTaskEstimationsRequestHandler : IRequestHandler<GetDefaultTaskEstimationsRequest, ProjectTaskDepartmentEstimationVm[]>
{
	private readonly ITasklyDbContext _dbContext;

	public GetDefaultTaskEstimationsRequestHandler(ITasklyDbContext dbContext, IConfiguration configuration)
	{
		_dbContext = dbContext;
	}

	public async Task<ProjectTaskDepartmentEstimationVm[]> Handle(GetDefaultTaskEstimationsRequest request, CancellationToken cancellationToken)
	{
		var project = new Project
		{
			Tasks = new List<ProjectTask>{
				new ProjectTask{
					ProjectTaskEstimations = new List<ProjectTaskEstimation>()
				}
			}
		};

		var deps = await _dbContext.Departments.AsNoTracking().Include(u => u.UserDepartments).ThenInclude(u => u.UserPosition).ToListAsync(cancellationToken);

		ProjectHelper.AddDefaultDepartments(project, deps);
		ProjectHelper.AddDefaultDepartmentPositionsToEstimationsVms(project, deps, cancellationToken);

		var vm = ProjectTaskVm.From(project.Tasks.ElementAt(0));
		return vm.DepartmentEstimations;
	}
}