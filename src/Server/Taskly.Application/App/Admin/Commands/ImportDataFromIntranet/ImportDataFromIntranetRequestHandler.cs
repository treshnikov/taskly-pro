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
                var intranetDbConnectionSettings = request.IntranetDbConnectionSettings;
                var iDepartments = await IntranetReader.LoadDepartmentsFromIntranetDbAsync(request.IntranetDbConnectionSettings, cancellationToken);
                var iUsers = await IntranetReader.LoadUsersFromIntranetDbAsync(request.IntranetDbConnectionSettings, cancellationToken);
                var iProjects = await IntranetReader.LoadProjectsFromIntranetDbAsync(request.IntranetDbConnectionSettings, cancellationToken);

                var sharepointHelper = new IntranetMerger(_dbContext);
                await sharepointHelper.UpdateUsers(iUsers, cancellationToken);
                await sharepointHelper.UpdateUserPositions(iUsers, cancellationToken);
                await sharepointHelper.UpdateDepartments(iDepartments, cancellationToken);
                await sharepointHelper.UpdateUserDepartmentLinks(iUsers, iDepartments, cancellationToken);
                await sharepointHelper.UpdateProjects(iProjects, cancellationToken);

                var projectTasksMerger = new SharepointProjectTasksMerger(_dbContext);
                await projectTasksMerger.UpdateProjectTasks(request.ProjectTasksFileName, cancellationToken);

                var projectPlanMerger = new SharepointProjectPlanMerger(_dbContext);
                await projectPlanMerger.UpdateProjectPlan("import/ОП ДС.XLSX", 244, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/ОП_АС.xlsx", 245, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/АСУТПвН.xlsx", 243, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/АСУТПвЭ.xlsx", 242, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/ИБ_и_ОСР.XLSX", 233, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/ПРСУ.XLSX", 176, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/СУПП.xlsx", 234, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/ЭМУ.xlsx", 179, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/ЭТЛ.xlsx", 177, cancellationToken);
                await projectPlanMerger.UpdateProjectPlan("import/ЭТО.xlsx", 178, cancellationToken);

                return Unit.Value;
            }
            catch (Exception e)
            {
                throw;
            }

        }


    }
}