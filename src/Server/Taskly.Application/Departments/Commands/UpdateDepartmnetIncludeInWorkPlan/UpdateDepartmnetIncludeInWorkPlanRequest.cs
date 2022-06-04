using MediatR;

namespace Taskly.Application.Departments.UpdateDepartment
{
    public class UpdateDepartmnetIncludeInWorkPlanRequest : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public bool IncludeInWorkPlan { get; set; }
    }
}