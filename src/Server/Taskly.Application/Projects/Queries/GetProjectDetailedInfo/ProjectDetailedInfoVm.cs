using Taskly.Domain;

namespace Taskly.Application.Projects
{
    public class ProjectTaskDepartmentEstimationVm
    {
        public Guid Id { get; set; }
        public Guid DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentShortName { get; set; }

        public EstimationVm[] Estimations { get; set; }

        public static ProjectTaskDepartmentEstimationVm From(ProjectTaskDepartmentEstimation arg)
        {
            return new ProjectTaskDepartmentEstimationVm
            {
                Id = arg.Id,
                DepartmentId = arg.Department.Id,
                DepartmentName = arg.Department.Name,
                DepartmentShortName = arg.Department.ShortName,
                Estimations = arg.Estimations.OrderBy(i => i.UserPosition?.Ident).Select(i => new EstimationVm
                {
                    Id = i.Id,
                    Hours = i.Hours,
                    UserPositionIdent = i.UserPosition?.Ident,
                    UserPositionName = i.UserPosition.Name,
                    UserPositionId = i.UserPosition.Id

                }).OrderBy(i => i.UserPositionIdent).ToArray()
            };
        }
    }

    public class ProjectTaskVm
    {
        public Guid Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Description { get; set; }
        public string Comment { get; set; }
        public ProjectTaskDepartmentEstimationVm[] DepartmentEstimations { get; set; }

        public static ProjectTaskVm From(ProjectTask arg)
        {
            return new ProjectTaskVm
            {
                Id = arg.Id,
                Description = arg.Description,
                Comment = arg.Comment,
                Start = arg.Start,
                End = arg.End,
                DepartmentEstimations = arg.DepartmentEstimations.Select(i => ProjectTaskDepartmentEstimationVm.From(i)).ToArray()
            };
        }
    }
    public class ProjectDetailedInfoVm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ShortName { get; set; }
        public string Company { get; set; }
        public bool IsOpened { get; set; }
        public bool IsExternal { get; set; }
        public string ProjectManager { get; set; }
        public string ChiefEngineer { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime? CloseDate { get; set; }
        public string Customer { get; set; }
        public string Contract { get; set; }
        public ProjectTaskVm[] Tasks { get; set; }

        public static ProjectDetailedInfoVm From(Project p)
        {
            return new ProjectDetailedInfoVm
            {
                Id = p.Id,
                ChiefEngineer = p.ChiefEngineer?.Name,
                CloseDate = p.CloseDate,
                Company = p.Company?.Name,
                Contract = p.Contract,
                Customer = p.Customer.Name,
                End = p.End,
                IsOpened = p.IsOpened,
                IsExternal = p.Type == ProjectType.External,
                Name = p.Name,
                ProjectManager = p.ProjectManager?.Name,
                ShortName = p.ShortName,
                Start = p.Start,
                Tasks = p.Tasks.Select(i => ProjectTaskVm.From(i)).ToArray()
            };
        }
    }
}