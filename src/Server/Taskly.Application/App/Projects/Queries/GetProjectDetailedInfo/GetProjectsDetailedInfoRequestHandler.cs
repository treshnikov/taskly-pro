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
        public GetProjectsDetailedInfoRequestHandler(ITasklyDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
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

            ProjectHelper.AddDefaultDepartments(project, deps);
            ProjectHelper.AddDefaultDepartmentPositionsToEstimationsVms(project, deps, cancellationToken);
            project.Tasks = project.Tasks.OrderBy(i => i.Start).ToArray();

            return ProjectDetailedInfoVm.From(project);
        }
}

}