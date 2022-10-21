using System.Security.Claims;
using HotChocolate.AspNetCore.Authorization;
using Taskly.Domain;

namespace Taskly.DAL;

public class GraphQLQuery
{
    [Authorize]
    public IQueryable<User> GetUsers(TasklyDbContext dbContext)
    {
        return dbContext.Users;
    }

    [Authorize]
    public IQueryable<Project> GetProjects(ClaimsPrincipal claimsPrincipal, TasklyDbContext dbContext)
    {
        var userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        return dbContext.Projects;
    }
}