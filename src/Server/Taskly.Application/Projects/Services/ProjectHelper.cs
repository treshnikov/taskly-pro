using Taskly.Domain;

namespace Taskly.Application.Projects
{
    public static class ProjectHelper
    {
        public static void AddDefaultUnits(Project project, List<Domain.Unit> units, int[] departmentCodes)
        {
            var defaultUnits = units.Where(u => u.Code.HasValue && departmentCodes.Contains(u.Code.Value)).ToList();

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

        public static async Task AddDefaultUnitPositionsToEstimationsVms(Project project, List<Domain.Unit> units, CancellationToken cancellationToken)
        {
            var depToUserPositions = GetExistingDepartmentPositions(units);

            foreach (var t in project.Tasks)
            {
                foreach (var ue in t.UnitEstimations)
                {
                    // add zero-estimation records for missed user positions 
                    var zeroEstimationPositionsToAdd = depToUserPositions[ue.Unit.Id]
                        .Where(dict => !ue.Estimations.Any(j => j.UserPosition.Id == dict.Id));
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

        public static Dictionary<Guid, HashSet<UserPosition>> GetExistingDepartmentPositions(List<Domain.Unit> units)
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