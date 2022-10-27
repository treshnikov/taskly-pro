using System.Text.Json;

namespace Taskly.IntegrationTests;

public class BaseTest
{
	protected static HttpContent JsonBody(object arg)
	{
		var json = JsonSerializer.Serialize(arg, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
		return new StringContent(json, System.Text.Encoding.UTF8, "application/json");
	}
}
