using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Projects.Commands.UpdateTasks;

public class SaveProjectChangesRequestHandler : IRequestHandler<SaveProjectChangesRequest, Unit>
{
	private readonly ITasklyDbContext _dbContext;

	public SaveProjectChangesRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task<Unit> Handle(SaveProjectChangesRequest request, CancellationToken cancellationToken)
	{
		using var transaction = _dbContext.Database.BeginTransaction();
		var dbProj = await _dbContext.Projects.Include(i => i.Tasks).FirstAsync(i => i.Id == request.ProjectId, cancellationToken: cancellationToken);

		foreach (var t in dbProj.Tasks)
		{
			var dbTask = await _dbContext.ProjectTasks.FirstAsync(i => i.Id == t.Id, cancellationToken: cancellationToken);
			_dbContext.ProjectTasks.Remove(dbTask);
		}
		await _dbContext.SaveChangesAsync(cancellationToken);

		foreach (var t in request.Tasks)
		{
			var newDbTask = new ProjectTask
			{
				Id = t.Id,
				ProjectId = request.ProjectId,
				Description = t.Description,
				Comment = t.Comment,
				Start = t.Start,
				End = t.End,
				ProjectTaskEstimations = new List<ProjectTaskEstimation>()
			};

			foreach (var est in t.DepartmentEstimations)
			{
				var newEst = new ProjectTaskEstimation
				{
					Id = Guid.NewGuid(),
					Department = await _dbContext.Departments.FirstAsync(i => i.Id == est.DepartmentId, cancellationToken),
					ProjectTaskId = newDbTask.Id,
					Estimations = new List<ProjectTaskUserPositionEstimation>()
				};

				foreach (var e in est.Estimations)
				{
					var u = new ProjectTaskUserPositionEstimation
					{
						Id = Guid.NewGuid(),
						UserPosition = await _dbContext.UserePositions.FirstAsync(i => i.Id == e.UserPositionId, cancellationToken),
						Hours = e.Hours,
						ProjectTaskDepartmentEstimationId = newEst.Id
					};

					newEst.Estimations.Add(u);
				}

				newDbTask.ProjectTaskEstimations.Add(newEst);
			}

			_dbContext.ProjectTasks.Add(newDbTask);
		}

		await _dbContext.SaveChangesAsync(cancellationToken);
		transaction.Commit();
		return Unit.Value;
	}
}