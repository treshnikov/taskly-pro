using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Users;

public class GetUserRequestHandler : IRequestHandler<GetUserRequest, UserVm>
{
	private readonly ITasklyDbContext _dbContext;
	public GetUserRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}
	public async Task<UserVm> Handle(GetUserRequest request, CancellationToken cancellationToken)
	{
		var user = await _dbContext
			.Users
			.Include(u => u.UserDepartments).ThenInclude(u => u.Department)
			.Include(u => u.UserDepartments).ThenInclude(u => u.UserPosition)
			.AsNoTracking()
			.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

		if (user == null)
		{
			throw new NotFoundException($"User with id {request.UserId} is not found.");
		}

		return await Task.FromResult(UserVm.FromUser(user));
	}
}
