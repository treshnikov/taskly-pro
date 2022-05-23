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
                        .ThenInclude(p => p.UnitEstimations).ThenInclude(i => i.Estimations).ThenInclude(i => i.UserPosition)
                    .Include(p => p.Tasks)
                        .ThenInclude(p => p.UnitEstimations).ThenInclude(p => p.Unit)
                .FirstAsync(i => i.Id == request.ProjectId, cancellationToken: cancellationToken);

            var units = await _dbContext.Units.AsNoTracking().Include(u => u.UserUnits).ThenInclude(u => u.UserPosition).ToListAsync(cancellationToken);

            AddDefaultUnits(project, units, cancellationToken);
            await AddDefaultUnitPositionsToEstimationsVms(project, units, cancellationToken);

            project.Tasks = project.Tasks.OrderBy(i => i.Start).ToArray();

            return ProjectDetailedInfoVm.From(project);
        }

        private void AddDefaultUnits(Project project, List<Domain.Unit> units, CancellationToken cancellationToken)
        {
            var defaultUnits = units.Where(u => u.Code.HasValue && _defaultDepartmentCodes.Contains(u.Code.Value)).ToList();

            foreach (var t in project.Tasks)
            {
                var unitsToAdd = defaultUnits.Where(i => !t.UnitEstimations.Any(j => j.Unit.Code == i.Code));
                foreach (var u in unitsToAdd)
                {
                    t.UnitEstimations.Add(new ProjectTaskUnitEstimation
                    {
                        // todo - this record does not exist in the DB, only in view model
                        Id = Guid.NewGuid(),
                        Estimations = new List<ProjectTaskUnitEstimationToUserPosition>(),
                        Unit = u,
                        ProjectTask = t,
                        ProjectTaskId = t.Id
                    });
                }
            }
        }

        private async Task AddDefaultUnitPositionsToEstimationsVms(Project project, List<Domain.Unit> units, CancellationToken cancellationToken)
        {
            var depToUserPositions = await GetExistingDepartmentPositions(units, cancellationToken);

            foreach (var t in project.Tasks)
            {
                foreach (var ue in t.UnitEstimations)
                {
                    // add zero-estimation records for missed user positions 
                    var zeroEstimationPositionsToAdd = depToUserPositions[ue.Unit.Id].Where(dict => !ue.Estimations.Any(j => j.UserPosition.Id == dict.Id));
                    foreach (var i in zeroEstimationPositionsToAdd)
                    {
                        ue.Estimations.Add(new ProjectTaskUnitEstimationToUserPosition()
                        {
                            // todo - this record does not exist in the DB, only in view model 
                            Id = Guid.NewGuid(),
                            ProjectTaskUnitEstimationId = Guid.NewGuid(),
                            Hours = 0,
                            UserPosition = i,
                        });
                    }

                    ue.Estimations = ue.Estimations.OrderBy(i => i.UserPosition.Name).ToList();
                }

                t.UnitEstimations = t.UnitEstimations.OrderBy(i => i.Unit.Name).ToList();
            }
        }

        private async Task<Dictionary<Guid, HashSet<UserPosition>>> GetExistingDepartmentPositions(List<Domain.Unit> units, CancellationToken cancellationToken)
        {
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

            return uniquePositionsInUnit;
        }
    }

}