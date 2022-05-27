using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Projects
{
    public class GetProjectsDetailedInfoRequestHandler : IRequestHandler<GetProjectsDetailedInfoRequest, ProjectDetailedInfoVm>
    {
        private readonly ITasklyDbContext _dbContext;
        private int[] _defaultDepartmentCodes;

        public GetProjectsDetailedInfoRequestHandler(ITasklyDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            var defaultDepartmentCodesStr = configuration["App:CodesOfDefaultDepartmentsForPlanning"] ?? "141, 244, 245, 234, 176, 232, 233, 242, 243, 177, 198, 199, 178, 179, 239";
            _defaultDepartmentCodes = defaultDepartmentCodesStr.Trim().Split(",").Select(i => int.Parse(i)).ToArray();
        }

        public async Task<ProjectDetailedInfoVm> Handle(GetProjectsDetailedInfoRequest request, CancellationToken cancellationToken)
        {
            var project = await _dbContext
                .Projects
                .AsNoTracking()
                    .Include(p => p.Customer)
                    .Include(p => p.ProjectManager)
                    .Include(p => p.ChiefEngineer)
                    .Include(p => p.Company)
                    .Include(p => p.Tasks)
                        .ThenInclude(p => p.DepartmentEstimations).ThenInclude(i => i.Estimations).ThenInclude(i => i.UserPosition)
                    .Include(p => p.Tasks)
                        .ThenInclude(p => p.DepartmentEstimations).ThenInclude(p => p.Department)
                .FirstAsync(i => i.Id == request.ProjectId, cancellationToken: cancellationToken);

            var deps = await _dbContext.Departments.AsNoTracking().Include(u => u.UserDepartments).ThenInclude(u => u.UserPosition).ToListAsync(cancellationToken);

            ProjectHelper.AddDefaultDepartments(project, deps, _defaultDepartmentCodes);
            await ProjectHelper.AddDefaultDepartmentPositionsToEstimationsVms(project, deps, cancellationToken);
            project.Tasks = project.Tasks.OrderBy(i => i.Start).ToArray();

            return ProjectDetailedInfoVm.From(project);
        }
}

}