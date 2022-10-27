using Taskly.Domain;

namespace Taskly.Application.Projects;

public class ProjectShortInfoVm
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string? ShortName { get; set; }
	public string Company { get; set; } = string.Empty;
	public bool IsExternal { get; set; }
	public bool IsOpened { get; set; }
	public string ProjectManager { get; set; } = string.Empty;
	public string ChiefEngineer { get; set; } = string.Empty;
	public DateTime Start { get; set; }
	public DateTime End { get; set; }
	public DateTime? CloseDate { get; set; }
	public string Customer { get; set; } = string.Empty;
	public string Contract { get; set; } = string.Empty;

	public static ProjectShortInfoVm FromProject(Project p)
	{
		return new ProjectShortInfoVm
		{
			Id = p.Id,
			ChiefEngineer = p.ChiefEngineer?.Name ?? string.Empty,
			CloseDate = p.CloseDate,
			Company = p.Company?.Name ?? string.Empty,
			Contract = p.Contract ?? string.Empty,
			Customer = p.Customer?.Name ?? string.Empty,
			IsExternal = p.Type == ProjectType.External,
			End = p.End,
			IsOpened = p.IsOpened,
			Name = p.Name,
			ProjectManager = p.ProjectManager?.Name ?? string.Empty,
			ShortName = p.ShortName,
			Start = p.Start,
		};
	}
}