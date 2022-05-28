using MediatR;

namespace Taskly.Application.Departments.UpdateDepartment
{
    public class UpdateDepartmnetEnableForPlanningRequest : IRequest<Unit>
    {
        public Guid Id { get; set; }
        public bool EnabledForPlanning { get; set; }
    }
}