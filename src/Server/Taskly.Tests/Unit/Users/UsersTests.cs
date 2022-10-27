using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Taskly.Application.Users;
using Taskly.Tests.Common;
using Xunit;

namespace Taskly.Tests.Notes.Commands;

public class UsersTests : TestCommandBase
{
	[Fact]
	public async Task EnsureAdminAccountHasBeenCreated()
	{
		// arrange
		var handler = new GetUsersRequestHandler(Context);

		//act
		var users = await handler.Handle(new GetUsersRequest(), CancellationToken.None);

		// assert
		Assert.NotNull(users.FirstOrDefault(u => u.Name == "admin"));
	}

	[Fact]
	public async Task UserCanBeFoundById()
	{
		// arrange
		var users = await new GetUsersRequestHandler(Context)
			.Handle(new GetUsersRequest(), CancellationToken.None);
		var admin = users.First(u => u.Name == "admin");

		//act
		var user = await new GetUserRequestHandler(Context)
			.Handle(new GetUserRequest { UserId = admin.Id }, CancellationToken.None);

		// assert
		Assert.NotNull(user);
	}
}