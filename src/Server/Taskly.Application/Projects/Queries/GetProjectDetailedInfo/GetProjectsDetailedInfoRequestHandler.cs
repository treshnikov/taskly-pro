using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Projects
{
    public class GetProjectsDetailedInfoRequestHandler : IRequestHandler<GetProjectsDetailedInfoRequest, ProjectDetailedInfoVm>
    {
        private readonly ITasklyDbContext _dbContext;
        public GetProjectsDetailedInfoRequestHandler(ITasklyDbContext dbContext)
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
                    .Include(p => p.Company).
                    Include(p => p.Tasks)
                        .ThenInclude(p => p.Estimations)
                        .ThenInclude(p => p.Unit)
                .FirstAsync(i => i.Id == request.ProjectId, cancellationToken: cancellationToken);

            return ProjectDetailedInfoVm.From(project);
        }
    }

}