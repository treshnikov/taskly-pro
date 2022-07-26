using Taskly.Application.Users;
using Taskly.WebApi;
using Xunit;

namespace Taskly.IntegrationTests;

public class UsersTests 
{
    [Fact]
    public async Task EnsureAdminAccountHasBeenCreated()
    {
        // arrange
        var webHost = new CustomWebApplicationFactory<Startup>() ;
        var httpClient = webHost.CreateClient();

        //act
        var response = await httpClient.GetAsync("/api/v1/users");
        var usersAsStr = await response.Content.ReadAsStringAsync();

        // assert
        Assert.Contains("admin@admin.com", usersAsStr);
    }

}