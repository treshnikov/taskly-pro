using Taskly.WebApi;

namespace Taskly.IntegrationTests;

public class IntegrationTestContext : IDisposable
{
    private readonly TasklyWebApplicationFactory<Startup> _webHost;
    public HttpClient HttpClient { get; init; }

    public IntegrationTestContext()
    {
        _webHost = new TasklyWebApplicationFactory<Startup>();
        HttpClient = _webHost.CreateClient();
    }

    public async Task Login(string email, string password)
    {
        var getTokenFormData = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("Email", email),
            new KeyValuePair<string, string>("Password", password)
        });

        var response = await HttpClient.PostAsync("api/v1/auth/token", getTokenFormData);
        var tokenAsStr = await response.Content.ReadAsStringAsync();
        var token = System.Text.Json.JsonSerializer.Deserialize<JwtVm>(tokenAsStr);
        HttpClient.DefaultRequestHeaders.Add("authorization", $"Bearer {token?.jwt}");
    }

    public void Dispose()
    {
        HttpClient?.Dispose();
        _webHost?.Dispose();
    }
}

internal class JwtVm
{
    public string jwt { get; set; }
}

