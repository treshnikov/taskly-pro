using MediatR;
using Taskly.Application.Departments.Queries.GetDepartmentPlan;

namespace Taskly.Application.Departments.Commands.UpdatePlans
{
    public class UpdateDepartmentPlanRequest : IRequest<Unit>
    {
        public Guid DepartmentId { get; set; }
        public DepartmentPlanRecordVm[] Data { get; set; }
    }

}