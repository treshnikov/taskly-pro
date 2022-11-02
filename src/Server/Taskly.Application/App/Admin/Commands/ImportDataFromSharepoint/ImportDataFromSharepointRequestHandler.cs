using MediatR;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Users;

public partial class ImportDataFromSharepointRequestHandler : IRequestHandler<ImportDataFromSharepointRequest>
{
	private readonly ITasklyDbContext _dbContext;
	public ImportDataFromSharepointRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<Unit> Handle(ImportDataFromSharepointRequest request, CancellationToken cancellationToken)
	{
		try
		{
			var sharepointTasksMerger = new SharepointProjectPlansMerger(_dbContext);
			await sharepointTasksMerger.MergeProjectPlans(request.ProjectTasksFileName, cancellationToken);

			var sharepointPlanMerger = new SharepointDepartmentPlanMerger(_dbContext);
			await sharepointPlanMerger.UpdateProjectPlan("import/ОП ДС.XLSX", 244, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/ОП_АС.xlsx", 245, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/АСУТПвН.xlsx", 243, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/АСУТПвЭ.xlsx", 242, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/ИБ_и_ОСР.XLSX", 233, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/ПРСУ.XLSX", 176, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/СУПП.xlsx", 234, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/ЭМУ.xlsx", 179, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/ЭТЛ.xlsx", 177, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/ЭТО.xlsx", 178, cancellationToken);
			await sharepointPlanMerger.UpdateProjectPlan("import/ПСА.xlsx", 239, cancellationToken);

			return Unit.Value;
		}
		catch (Exception)
		{
			throw;
		}
	}
}