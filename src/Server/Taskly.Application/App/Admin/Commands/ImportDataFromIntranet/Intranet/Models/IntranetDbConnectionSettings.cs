using System.ComponentModel.DataAnnotations;

namespace Taskly.Application.Users;

public class IntranetDbConnectionSettings
{
	[Required]
	public string Host { get; set; } = string.Empty;
	[Required]
	public uint Port { get; set; }
	[Required]
	public string User { get; set; } = string.Empty;
	[Required]
	public string Password { get; set; } = string.Empty;
	[Required]
	public string DbName { get; set; } = string.Empty;
}