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

                var sharepointTasksMerger = new SharepointProjectTasksMerger(_dbContext);
                await sharepointTasksMerger.UpdateProjectTasks(request.ProjectTasksFileName, cancellationToken);

                var sharepointPlanMerger = new SharepointProjectPlanMerger(_dbContext);
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

                return Unit.Value;
            }
            catch (Exception e)
            {
                throw;
            }

        }


    }
}