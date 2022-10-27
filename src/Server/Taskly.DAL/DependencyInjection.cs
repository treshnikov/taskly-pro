using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

		services
			.AddGraphQLServer()
			.AddAuthorization()
			.RegisterDbContext<TasklyDbContext>(DbContextKind.Synchronized)
			.AddQueryType<GraphQLQuery>()
			.AddFiltering();

		return services;
	}
}

