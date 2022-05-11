using Taskly.Domain;

namespace Taskly.Application.Projects
{
    public class ProjectShortInfoVm
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

        public static ProjectShortInfoVm FromProject(Project p)
        {
            return new ProjectShortInfoVm
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
            };
        }
    }
}