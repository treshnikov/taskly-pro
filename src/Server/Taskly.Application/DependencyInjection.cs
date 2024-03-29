using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Taskly.Application.Common.Behaviors;
using Taskly.Application.Jwt;
using Taskly.Application.Calendar;

namespace Taskly.Application;

public static class DependencyInjection
{
	public static IServiceCollection AddApplication(this IServiceCollection services)
	{
		services.AddMediatR(Assembly.GetExecutingAssembly());
		services.AddValidatorsFromAssemblies(new[] {
			Assembly.GetEntryAssembly(),
			Assembly.GetAssembly(typeof(DependencyInjection))
		});
		services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
		services.AddScoped<IJwtGenerator, JwtGenerator>();
		services.AddTransient<ICalendarService, CalendarService>();
		return services;
	}

}