using Taskly.Domain;

namespace Taskly.Application.Projects
{
    public class ProjectTaskUnitEstimationVm
    {
        public Guid Id { get; set; }
        public Guid UnitId { get; set; }
        public int DepartmentHeadHours { get; set; }
        public int LeadEngineerHours { get; set; }
        public int EngineerOfTheFirstCategoryHours { get; set; }
        public int EngineerOfTheSecondCategoryHours { get; set; }
        public int EngineerOfTheThirdCategoryHours { get; set; }

        public static ProjectTaskUnitEstimationVm From(ProjectTaskUnitEstimation arg)
        {
            return new ProjectTaskUnitEstimationVm
            {
                DepartmentHeadHours = arg.DepartmentHeadHours,
                EngineerOfTheFirstCategoryHours = arg.EngineerOfTheFirstCategoryHours,
                EngineerOfTheSecondCategoryHours = arg.EngineerOfTheSecondCategoryHours,
                EngineerOfTheThirdCategoryHours = arg.EngineerOfTheThirdCategoryHours,
                LeadEngineerHours = arg.LeadEngineerHours,
                Id = arg.Id,
                UnitId = arg.UnitId
            };
        }
    }

    public class ProjectTaskVm
    {
        public Guid Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Description { get; set; }
        public ProjectTaskUnitEstimationVm[] Estimations { get; set; }

        public static ProjectTaskVm From(ProjectTask arg)
        {
            return new ProjectTaskVm
            {
                Id = arg.Id,
                Description = arg.Description,
                Start = arg.Start,
                End = arg.End,
                Estimations = arg.Estimations.Select(i => ProjectTaskUnitEstimationVm.From(i)).ToArray()
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
        public string Start { get; set; }
        public string End { get; set; }
        public string? CloseDate { get; set; }
        public string Customer { get; set; }
        public string Contract { get; set; }
        public ProjectTaskVm[] Tasks { get; set; }

        public static ProjectDetailedInfoVm From(Project p)
        {
            return new ProjectDetailedInfoVm
            {
                Id = p.Id,
                ChiefEngineer = p.ChiefEngineer?.Name,
                CloseDate = p.CloseDate?.ToString("dd.MM.yyyy"),
                Company = p.Company?.Name,
                Contract = p.Contract,
                Customer = p.Customer.Name,
                End = p.End.ToString("dd.MM.yyyy"),
                IsOpened = p.IsOpened,
                Name = p.Name,
                ProjectManager = p.ProjectManager?.Name,
                ShortName = p.ShortName,
                Start = p.Start.ToString("dd.MM.yyyy"),
                Tasks = p.Tasks.Select(i => ProjectTaskVm.From(i)).ToArray()
            };
        }
    }
}