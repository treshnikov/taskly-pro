using System.Net;
using Taskly.Application.Users;
using Taskly.WebApi;
using Xunit;

namespace Taskly.IntegrationTests;

public class BaseTest
{
    private HttpClient? _httpClient = null;
    protected HttpClient HttpClient
    {
        get
        {
            if (_httpClient == null)
            {
                var webHost = new CustomWebApplicationFactory<Startup>();
                _httpClient = webHost.CreateClient();

                var getTokenFormData = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("Email", "admin@admin.com"),
                    new KeyValuePair<string, string>("Password", "admin")
                });

                var response = _httpClient.PostAsync("api/v1/auth/token", getTokenFormData).GetAwaiter().GetResult();
                var tokenAsStr = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                var token = System.Text.Json.JsonSerializer.Deserialize<JwtVm>(tokenAsStr);
                _httpClient.DefaultRequestHeaders.Add("authorization", $"Bearer {token?.jwt}");

            }

            return _httpClient;
        }
    }
}

internal class JwtVm
{
    public string jwt { get; set; }
}

