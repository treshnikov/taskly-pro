using MediatR;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Users;

public partial class ImportDataFromSharepointRequestHandler : IRequestHandler<ImportDataFromSharepointRequest>
{
	private readonly ITasklyDbContext _dbContext;

	private readonly Func<string, bool> _ibEmployees =
		arg => arg is "Пономарев Дмитрий Анатольевич" or
			   "Пономарева Елена Анатольевна" or
			   "Тимошкин Александр Олегович" or
			   "Карташов Станислав Александрович" or
			   "Мишанин Александр Сергеевич" or
			   "Сундукова Наталья Александровна";

	private readonly Func<string, bool> _osrEmployees =
		arg => arg is "Драгунов Алексей Сергеевич" or
					"Вареников Александр Игоревич" or
					"Коваленко Антон Владимирович" or
					"Осипов Алексей Олегович" or
					"Сидлецкий Артур Олегович" or
					"Шаталов Антон Николаевич" or
					"Стручков Владимир Андреевич" or
					"Шумаков Михаил Сергеевич" or
					"Драгунов Александр Александрович" or
					"Емельянов Федор Александрович";
					
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
			await sharepointPlanMerger.UpdateProjectPlan("import/ИБ_и_ОСР.XLSX", 233, cancellationToken, _ibEmployees);
			await sharepointPlanMerger.UpdateProjectPlan("import/ИБ_и_ОСР.XLSX", 232, cancellationToken, _osrEmployees);
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