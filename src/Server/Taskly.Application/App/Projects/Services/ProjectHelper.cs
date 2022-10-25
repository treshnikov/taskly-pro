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
                var depsToAdd = defaultDepartments.Where(i => !t.ProjectTaskEstimations.Any(j => j.Department.Code == i.Code));
                foreach (var u in depsToAdd)
                {
                    t.ProjectTaskEstimations.Add(new ProjectTaskEstimation
                    {
                        // todo - this record does not exist in the DB, only in view model
                        Id = Guid.NewGuid(),
                        Estimations = new List<ProjectTaskUserPositionEstimation>(),
                        Department = u,
                        ProjectTask = t,
                        ProjectTaskId = t.Id
                    });
                }
            }
        }

        public static void AddDefaultDepartmentPositionsToEstimationsVms(Project project, List<Department> deps, CancellationToken cancellationToken)
        {
            var depToUserPositions = GetExistingDepartmentPositions(deps);

            foreach (var t in project.Tasks)
            {
                foreach (var ue in t.ProjectTaskEstimations)
                {
                    // add zero-estimation records for missed user positions 
                    var zeroEstimationPositionsToAdd = depToUserPositions[ue.Department.Id]
                        .Where(dict => !ue.Estimations.Any(j => j.UserPosition.Id == dict.Id));
                    foreach (var i in zeroEstimationPositionsToAdd)
                    {
                        ue.Estimations.Add(new ProjectTaskUserPositionEstimation()
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

                t.ProjectTaskEstimations = t.ProjectTaskEstimations.OrderBy(i => i.Department.Name).ToList();
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