using Taskly.Domain;

namespace Taskly.Application.Projects
{
    public class ProjectTaskUnitEstimationVm
    {
        public Guid Id { get; set; }
        public Guid UnitId { get; set; }
        public string UnitName { get; set; }

        public EstimationVm[] Estimations { get; set; }

        public static ProjectTaskUnitEstimationVm From(ProjectTaskUnitEstimation arg)
        {
            return new ProjectTaskUnitEstimationVm
            {
                Id = arg.Id,
                UnitId = arg.Unit.Id,
                UnitName = arg.Unit.Name,
                Estimations = arg.Estimations.OrderBy(i => i.UserPosition?.Ident).Select(i => new EstimationVm
                {
                    Hours = i.Hours,
                    UserPositionIdent = i.UserPosition?.Ident,
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
        public ProjectTaskUnitEstimationVm[] UnitEstimations { get; set; }

        public static ProjectTaskVm From(ProjectTask arg)
        {
            return new ProjectTaskVm
            {
                Id = arg.Id,
                Description = arg.Description,
                Comment = arg.Comment,
                Start = arg.Start,
                End = arg.End,
                UnitEstimations = arg.UnitEstimations.Select(i => ProjectTaskUnitEstimationVm.From(i)).ToArray()
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
                Name = p.Name,
                ProjectManager = p.ProjectManager?.Name,
                ShortName = p.ShortName,
                Start = p.Start,
                Tasks = p.Tasks.Select(i => ProjectTaskVm.From(i)).ToArray()
            };
        }
    }
}