namespace Taskly.Application.Users;

public class IntranetDbConnectionSettings
{
	public string Host { get; set; } = string.Empty;
	public uint Port { get; set; }
	public string User { get; set; } = string.Empty;
	public string Password { get; set; } = string.Empty;
	public string DbName { get; set; } = string.Empty;
}
