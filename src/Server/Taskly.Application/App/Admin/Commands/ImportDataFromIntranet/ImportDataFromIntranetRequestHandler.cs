using MediatR;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Users;

public partial class ImportDataFromIntranetRequestHandler : IRequestHandler<ImportDataFromIntranetRequest>
{
	private readonly ITasklyDbContext _dbContext;
	public ImportDataFromIntranetRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<Unit> Handle(ImportDataFromIntranetRequest request, CancellationToken cancellationToken)
	{
		try
		{
			var iReader = new IntranetReader(request.IntranetDbConnectionSettings);
			var iDepartments = await iReader.LoadDepartmentsAsync(cancellationToken);
			var iUsers = await iReader.LoadUsersAsync(cancellationToken);
			var iProjects = await iReader.LoadProjectsAsync(cancellationToken);
			var iNonWorkingDays = await iReader.LoadCalendarAsync(cancellationToken);
			var iVacations = await iReader.LoadVacationsAsync(cancellationToken);

			var iMerger = new IntranetMerger(_dbContext);
			await iMerger.UpdateUsers(iUsers, cancellationToken);
			await iMerger.UpdateUserPositions(iUsers, cancellationToken);
			await iMerger.UpdateDepartments(iDepartments, cancellationToken);
			await iMerger.UpdateUserDepartmentLinks(iUsers, iDepartments, cancellationToken);
			await iMerger.UpdateProjects(iProjects, cancellationToken);
			await iMerger.UpdateCalendar(iNonWorkingDays, cancellationToken);
			await iMerger.UpdateVacations(iVacations, cancellationToken);

			return Unit.Value;
		}
		catch (Exception)
		{
			throw;
		}

	}


}