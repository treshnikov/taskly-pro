using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Projects.Queries
{
    public class GetDefaultTaskEstimationsRequestHandler : IRequestHandler<GetDefaultTaskEstimationsRequest, ProjectTaskDepartmentEstimationVm[]>
    {
        private readonly ITasklyDbContext _dbContext;
        private int[] _defaultDepartmentCodes;

        public GetDefaultTaskEstimationsRequestHandler(ITasklyDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            var defaultDepartmentCodesStr = configuration["App:CodesOfDefaultDepartmentsForPlanning"] ?? "141, 244, 245, 234, 176, 232, 233, 242, 243, 177, 198, 199, 178, 179, 239";
            _defaultDepartmentCodes = defaultDepartmentCodesStr.Trim().Split(",").Select(i => int.Parse(i)).ToArray();
        }

        public async Task<ProjectTaskDepartmentEstimationVm[]> Handle(GetDefaultTaskEstimationsRequest request, CancellationToken cancellationToken)
        {
            var project = new Project
            {
                Tasks = new List<ProjectTask>{
                    new ProjectTask{
                        DepartmentEstimations = new List<ProjectTaskDepartmentEstimation>()
                    }
                }
            };

            var deps = await _dbContext.Departments.AsNoTracking().Include(u => u.UserDepartments).ThenInclude(u => u.UserPosition).ToListAsync(cancellationToken);

            ProjectHelper.AddDefaultDepartments(project, deps, _defaultDepartmentCodes);
            await ProjectHelper.AddDefaultDepartmentPositionsToEstimationsVms(project, deps, cancellationToken);

            var vm = ProjectTaskVm.From(project.Tasks.ElementAt(0));
            return vm.DepartmentEstimations;
        }
    }

}