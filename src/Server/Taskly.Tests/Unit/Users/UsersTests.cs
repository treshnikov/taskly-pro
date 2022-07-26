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
        var handler = new GetUsersRequestHandler(Context, Mapper);

        //act
        var users = await handler.Handle(new GetUsersRequest(), CancellationToken.None);

        // assert
        Assert.NotNull(users.FirstOrDefault(u => u.Name == "admin"));
    }

    [Fact]
    public async Task UserCanBeFoundById()
    {
        // arrange
        var users = await new GetUsersRequestHandler(Context, Mapper)
            .Handle(new GetUsersRequest(), CancellationToken.None);
        var admin = users.First(u => u.Name == "admin");

        //act
        var user = await new GetUserRequestHandler(Context, Mapper)
            .Handle(new GetUserRequest { UserId = admin.Id }, CancellationToken.None);

        // assert
        Assert.NotNull(user);
    }    
}