using System.Net;
using Taskly.Application.Users;
using Taskly.WebApi;
using Xunit;

namespace Taskly.IntegrationTests;

public class UsersTests : BaseTest
{
    [Fact]
    public async Task EnsureAdminAccountHasBeenCreated()
    {
        // arrange

        // act
        var response = await HttpClient.GetAsync("/api/v1/users");
        var usersAsStr = await response.Content.ReadAsStringAsync();

        // assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("admin@admin.com", usersAsStr);
    }
}