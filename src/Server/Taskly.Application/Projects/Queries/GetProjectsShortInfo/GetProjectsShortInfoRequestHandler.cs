using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Projects
{
    public class GetProjectsShortInfoRequestHandler : IRequestHandler<GetProjectsShortInfoRequest, ProjectShortInfoVm[]>
    {
        private readonly ITasklyDbContext _dbContext;
        public GetProjectsShortInfoRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<ProjectShortInfoVm[]> Handle(GetProjectsShortInfoRequest request, CancellationToken cancellationToken)
        {
            var projects = await _dbContext
                .Projects
                .Include(p => p.Customer).Include(p => p.ProjectManager).Include(p => p.ChiefEngineer).Include(p => p.Company)
                .AsNoTracking()
                .OrderByDescending(p => p.IsOpened).ThenByDescending(p => p.Id)
                .Select(p => ProjectShortInfoVm.FromProject(p))
                .ToListAsync(cancellationToken: cancellationToken);
            
            return projects.ToArray();
        }
    }

}