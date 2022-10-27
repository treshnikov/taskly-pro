using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Projects.Commands.DeleteTask;

public class DeleteTaskRequestHandler : IRequestHandler<DeleteTaskRequest, Unit>
{
	private readonly ITasklyDbContext _dbContext;

	public DeleteTaskRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<Unit> Handle(DeleteTaskRequest request, CancellationToken cancellationToken)
	{
		var task = await _dbContext.ProjectTasks.FirstOrDefaultAsync(i => i.Id == request.TaskId, cancellationToken);
		if (task == null)
		{
			throw new NotFoundException("Task not found");
		}

		_dbContext.ProjectTasks.Remove(task);
		await _dbContext.SaveChangesAsync(cancellationToken);
		return Unit.Value;
	}
}