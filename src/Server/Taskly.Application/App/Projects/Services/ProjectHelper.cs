using Taskly.Domain;

namespace Taskly.Application.Projects
{
    public static class ProjectHelper
    {
        public static void AddDefaultDepartments(Project project, List<Domain.Department> deps)
        {
            var defaultDepartments = deps.Where(dep => dep.IncludeInWorkPlan == true).ToList();

            foreach (var t in project.Tasks)
            {
                var depsToAdd = defaultDepartments.Where(i => !t.DepartmentEstimations.Any(j => j.Department.Code == i.Code));
                foreach (var u in depsToAdd)
                {
                    t.DepartmentEstimations.Add(new ProjectTaskDepartmentEstimation
                    {
                        // todo - this record does not exist in the DB, only in view model
                        Id = Guid.NewGuid(),
                        Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>(),
                        Department = u,
                        ProjectTask = t,
                        ProjectTaskId = t.Id
                    });
                }
            }
        }

        public static async Task AddDefaultDepartmentPositionsToEstimationsVms(Project project, List<Domain.Department> deps, CancellationToken cancellationToken)
        {
            var depToUserPositions = GetExistingDepartmentPositions(deps);

            foreach (var t in project.Tasks)
            {
                foreach (var ue in t.DepartmentEstimations)
                {
                    // add zero-estimation records for missed user positions 
                    var zeroEstimationPositionsToAdd = depToUserPositions[ue.Department.Id]
                        .Where(dict => !ue.Estimations.Any(j => j.UserPosition.Id == dict.Id));
                    foreach (var i in zeroEstimationPositionsToAdd)
                    {
                        ue.Estimations.Add(new ProjectTaskDepartmentEstimationToUserPosition()
                        {
                            // todo - this record does not exist in the DB, only in view model 
                            Id = Guid.NewGuid(),
                            ProjectTaskDepartmentEstimationId = Guid.NewGuid(),
                            Hours = 0,
                            UserPosition = i,
                        });
                    }

                    ue.Estimations = ue.Estimations.OrderBy(i => i.UserPosition.Name).ToList();
                }

                t.DepartmentEstimations = t.DepartmentEstimations.OrderBy(i => i.Department.Name).ToList();
            }
        }

        public static Dictionary<Guid, HashSet<UserPosition>> GetExistingDepartmentPositions(List<Domain.Department> deps)
        {
            Dictionary<Guid, HashSet<UserPosition>> uniquePositionsInDep = new();
            foreach (var u in deps)
            {
                uniquePositionsInDep[u.Id] = new();
                foreach (var uu in u.UserDepartments)
                {
                    if (!uniquePositionsInDep[u.Id].Contains(uu.UserPosition))
                    {
                        uniquePositionsInDep[u.Id].Add(uu.UserPosition);
                    }
                }
            }

            return uniquePositionsInDep;
        }
            
    }
}