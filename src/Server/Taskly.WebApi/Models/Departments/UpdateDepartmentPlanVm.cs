using Taskly.Application.Departments.Queries.GetDepartmentPlan;

namespace Taskly.WebApi.Models;

public class UpdateDepartmentPlanVm
{
    public Guid DepartmentId { get; set; }
    public DepartmentPlanRecordVm[] Data { get; set; }
}