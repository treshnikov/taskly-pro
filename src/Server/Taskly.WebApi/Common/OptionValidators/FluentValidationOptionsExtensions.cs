using FluentValidation;
using Microsoft.Extensions.Options;

namespace Taskly.WebApi.Common;

public static class FluentValidationOptionsExtensions
{
	public static OptionsBuilder<TOptions> AddOptionsWithValidation<TOptions, TValidator>(
		this IServiceCollection services,
		string configurationSection)
	where TOptions : class
	where TValidator : class, IValidator<TOptions>
	{
		services.AddScoped<IValidator<TOptions>, TValidator>();
		services.AddScoped(resolver => resolver.GetRequiredService<IOptions<TOptions>>().Value);

		return services.AddOptions<TOptions>()
			.BindConfiguration(configurationSection)
			.ValidateFluentValidation()
			.ValidateOnStart();
	}
}
