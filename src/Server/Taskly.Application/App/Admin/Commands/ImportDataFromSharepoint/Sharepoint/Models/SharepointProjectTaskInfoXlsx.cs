using Taskly.Domain;

namespace Taskly.Application.Users;

public class SharepointProjectTaskInfoXlsx
{
	public int? ProjectId { get; set; }
	public string? ProjectName { get; set; }
	public ProjectType ProjectType { get; set; }
	public string Description { get; set; } = string.Empty;
	public string Comment { get; set; } = string.Empty;
	public DateTime Start { get; set; }
	public DateTime End { get; set; }
	public string[] Estimations { get; set; } = Array.Empty<string>();
}