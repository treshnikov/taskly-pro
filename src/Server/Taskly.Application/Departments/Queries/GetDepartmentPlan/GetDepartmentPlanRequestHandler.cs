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
            // get department by id
            // get users of the department
            // get projects that have any estimation for the given department or projects that have been planned before
            // build a list of weeks according to start and end dates
            // laod plans for each employee for each week for each project
            // compose view model

            return Task.FromResult(new List<DepartmentPlanRecordVm>().ToArray());
        }
    }
}