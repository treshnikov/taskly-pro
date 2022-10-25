using System.Security.Claims;
using HotChocolate.AspNetCore.Authorization;
using Taskly.Domain;

namespace Taskly.DAL;

public class GraphQLQuery
{
    [Authorize]
    [UseFiltering]
    public IQueryable<User> GetUsers(TasklyDbContext dbContext)
    {
        return dbContext.Users;
    }

    [Authorize]
    public IQueryable<User> GetUsersByName(string userName, TasklyDbContext dbContext)
    {
        return dbContext.Users.Where(i => i.Name.Contains(userName));
    }
    
    [Authorize]
    [UseFiltering]
    public IQueryable<Project> GetProjects(TasklyDbContext dbContext)
    {
        return dbContext.Projects;
    }
}