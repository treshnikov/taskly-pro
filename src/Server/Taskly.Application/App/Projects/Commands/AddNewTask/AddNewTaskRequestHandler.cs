using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Projects.Commands.AddNewTask
{
    public class AddNewTaskRequestHandler : IRequestHandler<AddNewTaskRequest, ProjectTaskVm>
    {
        private ITasklyDbContext _dbContext;

        public AddNewTaskRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ProjectTaskVm> Handle(AddNewTaskRequest request, CancellationToken cancellationToken)
        {
            var proj = await _dbContext.Projects.AsNoTracking().FirstAsync(i => i.Id == request.ProjectId, cancellationToken);
            
            var newTask = new ProjectTask
            {
                Id = Guid.NewGuid(),
                ProjectId = proj.Id,
                Comment = "...",
                Description = "...",
                Start = proj.Start,
                End = proj.End,
                ProjectTaskEstimations = new List<ProjectTaskEstimation>(),
            };
            _dbContext.ProjectTasks.Add(newTask);
            await _dbContext.SaveChangesAsync(cancellationToken);
            
            return await Task.FromResult(ProjectTaskVm.From(newTask));
        }
    }
}