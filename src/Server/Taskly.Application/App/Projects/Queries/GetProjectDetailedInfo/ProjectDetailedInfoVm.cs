using Taskly.Domain;

namespace Taskly.Application.Projects;

public class ProjectTaskDepartmentEstimationVm
{
	public Guid Id { get; set; }
	public Guid DepartmentId { get; set; }
	public string DepartmentName { get; set; } = string.Empty;
	public string DepartmentShortName { get; set; } = string.Empty;

	public EstimationVm[] Estimations { get; set; } = Array.Empty<EstimationVm>();
	public static ProjectTaskDepartmentEstimationVm From(ProjectTaskEstimation arg)
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
				UserPositionName = i.UserPosition!.Name,
				UserPositionId = i.UserPosition!.Id

			}).OrderBy(i => i.UserPositionIdent).ToArray()
		};
	}
}

public class ProjectTaskVm
{
	public Guid Id { get; set; }
	public DateTime Start { get; set; }
	public DateTime End { get; set; }
	public string Description { get; set; } = string.Empty;
	public string? Comment { get; set; }
	public ProjectTaskDepartmentEstimationVm[] DepartmentEstimations { get; set; } = Array.Empty<ProjectTaskDepartmentEstimationVm>();

	public static ProjectTaskVm From(ProjectTask arg)
	{
		return new ProjectTaskVm
		{
			Id = arg.Id,
			Description = arg.Description,
			Comment = arg.Comment,
			Start = arg.Start,
			End = arg.End,
			DepartmentEstimations = arg.ProjectTaskEstimations.Select(i => ProjectTaskDepartmentEstimationVm.From(i)).ToArray()
		};
	}
}
public class ProjectDetailedInfoVm
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string? ShortName { get; set; }
	public string Company { get; set; } = string.Empty;
	public bool IsOpened { get; set; }
	public bool IsExternal { get; set; }
	public string ProjectManager { get; set; } = string.Empty;
	public string ChiefEngineer { get; set; } = string.Empty;
	public DateTime Start { get; set; }
	public DateTime End { get; set; }
	public DateTime? CloseDate { get; set; }
	public string Customer { get; set; } = string.Empty;
	public string Contract { get; set; } = string.Empty;
	public ProjectTaskVm[] Tasks { get; set; } = Array.Empty<ProjectTaskVm>();

	public static ProjectDetailedInfoVm From(Project p)
	{
		return new ProjectDetailedInfoVm
		{
			Id = p.Id,
			ChiefEngineer = p.ChiefEngineer?.Name ?? string.Empty,
			CloseDate = p.CloseDate,
			Company = p.Company?.Name ?? string.Empty,
			Contract = p.Contract ?? string.Empty,
			Customer = p.Customer?.Name ?? string.Empty,
			End = p.End,
			IsOpened = p.IsOpened,
			IsExternal = p.Type == ProjectType.External,
			Name = p.Name,
			ProjectManager = p.ProjectManager?.Name ?? string.Empty,
			ShortName = p.ShortName,
			Start = p.Start,
			Tasks = p.Tasks.Select(i => ProjectTaskVm.From(i)).ToArray()
		};
	}
}