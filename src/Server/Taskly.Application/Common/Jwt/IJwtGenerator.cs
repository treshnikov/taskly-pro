using Taskly.Domain;

namespace Taskly.Application.Jwt
{
    public interface IJwtGenerator
    {
        string CreateToken(User user);
    }
}