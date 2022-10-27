using System.Net;
using Taskly.Application.Users;
using Xunit;

namespace Taskly.IntegrationTests;

public class UsersTests : BaseTest
{
	[Fact]
	public async Task EnsureAdminAccountHasBeenCreated()
	{
		// arrange
		using var ctx = new IntegrationTestContext();
		await ctx.Login("admin@admin.com", "admin");

		// act
		var response = await ctx.HttpClient.GetAsync("/api/v1/users");
		var usersAsStr = await response.Content.ReadAsStringAsync();
		var users = System.Text.Json.JsonSerializer.Deserialize<UserVm[]>(usersAsStr, new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase });

		// assert
		Assert.Equal(HttpStatusCode.OK, response.StatusCode);
		Assert.Contains(users, u => u.Email == "admin@admin.com");
	}
}