using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Departments.UpdateDepartment
{
    public class UpdateDepartmnetEnableForPlanningRequestHandler : IRequestHandler<UpdateDepartmnetEnableForPlanningRequest, Unit>
    {
        private readonly ITasklyDbContext _dbContext;
        public UpdateDepartmnetEnableForPlanningRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Unit> Handle(UpdateDepartmnetEnableForPlanningRequest request, CancellationToken cancellationToken)
        {
            var dep = await _dbContext.Departments.FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);
            if (dep == null)
            {
                throw new NotFoundException($"Department with Id={request.Id} is not found.");
            }

            dep.EnabledForPlanning = request.EnabledForPlanning;
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;

        }
    }

}