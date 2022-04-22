using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Taskly.DAL;
using Taskly.Application.Interfaces;

namespace Taskly.DAL;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration["DbConnection"];
        services.AddDbContext<TasklyDbContext>(opt =>
        {
            opt.UseSqlite(connectionString);
        });

        services.AddScoped<ITasklyDbContext, TasklyDbContext>();
        return services;
    }
}