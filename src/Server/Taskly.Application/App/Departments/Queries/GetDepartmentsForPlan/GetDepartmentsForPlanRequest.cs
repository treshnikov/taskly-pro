using MediatR;

namespace Taskly.Application.Departments.Queries.GetDepartmentsForPlan
{
    public class GetDepartmentsForPlanRequest : IRequest<DepartmentShortInfoVm[]>
    {
        
    }

}