using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Projects.Queries
{
    public class GetDefaultTaskEstimationsRequestHandler : IRequestHandler<GetDefaultTaskEstimationsRequest, ProjectTaskUnitEstimationVm[]>
    {
        private readonly ITasklyDbContext _dbContext;
        private int[] _defaultDepartmentCodes;

        public GetDefaultTaskEstimationsRequestHandler(ITasklyDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            var defaultDepartmentCodesStr = configuration["App:CodesOfDefaultDepartmentsForPlanning"] ?? "141, 244, 245, 234, 176, 232, 233, 242, 243, 177, 198, 199, 178, 179, 239";
            _defaultDepartmentCodes = defaultDepartmentCodesStr.Trim().Split(",").Select(i => int.Parse(i)).ToArray();
        }

        public async Task<ProjectTaskUnitEstimationVm[]> Handle(GetDefaultTaskEstimationsRequest request, CancellationToken cancellationToken)
        {
            var project = new Project
            {
                Tasks = new List<ProjectTask>{
                    new ProjectTask{
                        UnitEstimations = new List<ProjectTaskUnitEstimation>()
                    }
                }
            };

            var units = await _dbContext.Units.AsNoTracking().Include(u => u.UserUnits).ThenInclude(u => u.UserPosition).ToListAsync(cancellationToken);

            ProjectHelper.AddDefaultUnits(project, units, _defaultDepartmentCodes);
            await ProjectHelper.AddDefaultUnitPositionsToEstimationsVms(project, units, cancellationToken);

            var vm = ProjectTaskVm.From(project.Tasks.ElementAt(0));
            return vm.UnitEstimations;
        }
    }

}