using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Taskly.Application.Interfaces;
using Taskly.Application.Common.Behaviors;
using Taskly.Application.Jwt;

namespace Taskly.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssemblies(new[] {
            Assembly.GetEntryAssembly(),
            Assembly.GetAssembly(typeof(Taskly.Application.DependencyInjection))
        });
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddScoped<IJwtGenerator, JwtGenerator>();
        return services;
    }

}