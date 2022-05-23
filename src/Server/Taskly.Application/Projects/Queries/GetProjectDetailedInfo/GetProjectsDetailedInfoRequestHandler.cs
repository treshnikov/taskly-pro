using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;

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
            var units = await _dbContext.Units.AsNoTracking().Include(u => u.UserUnits).ThenInclude(u => u.UserPosition).ToListAsync(cancellationToken);
            Dictionary<Guid, HashSet<UserPosition>> uniquePositionsInUnit = new();
            foreach (var u in units)
            {
                uniquePositionsInUnit[u.Id] = new();
                foreach (var uu in u.UserUnits)
                {
                    if (!uniquePositionsInUnit[u.Id].Contains(uu.UserPosition))
                    {
                        uniquePositionsInUnit[u.Id].Add(uu.UserPosition);
                    }
                }
            }

            var project = await _dbContext
                .Projects
                .AsNoTracking()
                    .Include(p => p.Customer)
                    .Include(p => p.ProjectManager)
                    .Include(p => p.ChiefEngineer)
                    .Include(p => p.Company)
                    .Include(p => p.Tasks)
                        .ThenInclude(p => p.UnitEstimations).ThenInclude(i => i.Estimations).ThenInclude(i => i.UserPosition)
                    .Include(p => p.Tasks)
                        .ThenInclude(p => p.UnitEstimations).ThenInclude(p => p.Unit)
                .FirstAsync(i => i.Id == request.ProjectId, cancellationToken: cancellationToken);

            foreach (var t in project.Tasks)
            {
                foreach (var ue in t.UnitEstimations)
                {
                    var positionsToAdd = uniquePositionsInUnit[ue.Unit.Id].Where(dict => !ue.Estimations.Any(j => j.UserPosition.Id == dict.Id));
                    foreach (var addItem in positionsToAdd)
                    {
                        ue.Estimations.Add(new ProjectTaskUnitEstimationToUserPosition()
                        {
                            // todo
                            Id = Guid.NewGuid(),
                            ProjectTaskUnitEstimationId = Guid.NewGuid(),
                            Hours = 0,
                            UserPosition = addItem,
                        });
                    }

                    ue.Estimations = ue.Estimations.OrderBy(i => i.UserPosition.Name).ToList();
                }


                t.UnitEstimations = t.UnitEstimations.OrderBy(i => i.Unit.Name).ToList();
            }

            project.Tasks = project.Tasks.OrderBy(i => i.Start).ToArray();

            return ProjectDetailedInfoVm.From(project);
        }
    }

}