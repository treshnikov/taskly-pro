namespace Taskly.Domain;

public class UserPosition
{
	public Guid Id { get; set; }
	public string? Ident { get; set; }
	public string Name { get; set; } = string.Empty;
}