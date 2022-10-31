using Microsoft.Extensions.Options;

namespace Taskly.WebApi.Common;

public static class OptionsBuilderFluentValidationExtensions
{
	public static OptionsBuilder<TOptions> ValidateFluentValidation<TOptions>(
	  this OptionsBuilder<TOptions> optionsBuilder) where TOptions : class
	{
		optionsBuilder
			.Services
			.AddSingleton<IValidateOptions<TOptions>>(
				conf => new FluentValidationOptions<TOptions>(optionsBuilder.Name, conf));

		return optionsBuilder;
	}
}
