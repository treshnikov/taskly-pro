using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.App.Users.Specs;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Users;

public class GetUsersRequestHandler : IRequestHandler<GetUsersRequest, IEnumerable<UserVm>>
{
	private readonly ITasklyDbContext _dbContext;
	public GetUsersRequestHandler(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}
	public async Task<IEnumerable<UserVm>> Handle(GetUsersRequest request, CancellationToken cancellationToken)
	{
		var users = await _dbContext
			.Users
			.Include(u => u.UserDepartments).ThenInclude(u => u.Department)
			.Include(u => u.UserDepartments).ThenInclude(u => u.UserPosition)
			.Where(UserSpecs.WorksInTheCompany)
			.AsNoTracking()
			.OrderBy(u => u.Name)
			.Select(u => UserVm.FromUser(u))
			.ToListAsync(cancellationToken: cancellationToken);

		return users;
	}

}
