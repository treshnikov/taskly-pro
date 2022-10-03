using MediatR;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Users
{
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
                var iDepartments = await iReader.LoadDepartmentsFromIntranetDbAsync(cancellationToken);
                var iUsers = await iReader.LoadUsersFromIntranetDbAsync(cancellationToken);
                var iProjects = await iReader.LoadProjectsFromIntranetDbAsync(cancellationToken);

                var iMerger = new IntranetMerger(_dbContext);
                await iMerger.UpdateUsers(iUsers, cancellationToken);
                await iMerger.UpdateUserPositions(iUsers, cancellationToken);
                await iMerger.UpdateDepartments(iDepartments, cancellationToken);
                await iMerger.UpdateUserDepartmentLinks(iUsers, iDepartments, cancellationToken);
                await iMerger.UpdateProjects(iProjects, cancellationToken);

                return Unit.Value;
            }
            catch (Exception e)
            {
                throw;
            }

        }


    }
}