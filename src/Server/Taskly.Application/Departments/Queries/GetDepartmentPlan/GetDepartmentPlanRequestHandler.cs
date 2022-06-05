using MediatR;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Departments.Queries.GetDepartmentPlan
{
    public class GetDepartmentPlanRequestHandler : IRequestHandler<GetDepartmentPlanRequest, DepartmentPlanRecordVm[]>
    {
        private readonly ITasklyDbContext _dbContext;
        public GetDepartmentPlanRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public Task<DepartmentPlanRecordVm[]> Handle(GetDepartmentPlanRequest request, CancellationToken cancellationToken)
        {
            return Task.FromResult(new List<DepartmentPlanRecordVm>().ToArray());
        }
    }
}