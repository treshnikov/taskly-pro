using System.Security.Claims;
using Taskly.Application.Interfaces;

namespace Taskly.WebApi.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public Guid UserId {
        get
        {
            var id = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            return string.IsNullOrEmpty(id)
                ? Guid.Empty
                : Guid.Parse(id);
        }
    }

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
}

public interface ICurrentUserService
{
    Guid UserId { get; }
}