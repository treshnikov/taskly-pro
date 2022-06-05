using MediatR;

namespace Taskly.Application.Departments.Queries.GetDepartmentPlan
{
    public class GetDepartmentPlanRequest : IRequest<DepartmentPlanRecordVm[]>
    {
        public Guid DepartmentId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}