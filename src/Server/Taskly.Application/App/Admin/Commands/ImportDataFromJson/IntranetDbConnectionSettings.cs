using Taskly.Application.Departments.Queries.GetDepartmentPlan;

namespace Taskly.Application.Users;

public class IntranetDbConnectionSettings
{
    public string Host { get; set; }
    public uint Port { get; set; }
    public string User { get; set; }
    public string Password { get; set; }
    public string DbName { get; set; }
}