using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Taskly.Application.Interfaces;

namespace Taskly.DAL;

public class TasklyPersistenceOptions
{
	public string DbConnectionString { get; set; } = string.Empty;
}

public static class DependencyInjection
{

	public static IServiceCollection AddPersistence(this IServiceCollection services, Action<TasklyPersistenceOptions> config)
	{
		if (config == null)
		{
			throw new ArgumentException(null, nameof(config));
		}

		TasklyPersistenceOptions tasklyPersistanceOptions = new();
		config(tasklyPersistanceOptions);
		services.AddDbContext<TasklyDbContext>(opt =>
		{
			opt.UseSqlite(tasklyPersistanceOptions.DbConnectionString);
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

