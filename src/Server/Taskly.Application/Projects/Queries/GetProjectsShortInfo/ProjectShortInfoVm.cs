using Taskly.Domain;

namespace Taskly.Application.Projects
{
    public class ProjectShortInfoVm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ShortName { get; set; }
        public string Company { get; set; }
        public bool IsExternal { get; set; }
        public bool IsOpened { get; set; }
        public string ProjectManager { get; set; }
        public string ChiefEngineer { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime? CloseDate { get; set; }
        public string Customer { get; set; }
        public string Contract { get; set; }

        public static ProjectShortInfoVm FromProject(Project p)
        {
            return new ProjectShortInfoVm
            {
                Id = p.Id,
                ChiefEngineer = p.ChiefEngineer?.Name,
                CloseDate = p.CloseDate,
                Company = p.Company?.Name,
                Contract = p.Contract,
                Customer = p.Customer.Name,
                IsExternal = p.Type == ProjectType.External,
                End = p.End,
                IsOpened = p.IsOpened,
                Name = p.Name,
                ProjectManager = p.ProjectManager?.Name,
                ShortName = p.ShortName,
                Start = p.Start,
            };
        }
    }
}