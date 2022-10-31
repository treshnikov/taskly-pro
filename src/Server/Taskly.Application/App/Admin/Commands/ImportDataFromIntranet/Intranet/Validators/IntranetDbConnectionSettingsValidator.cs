using FluentValidation;

namespace Taskly.Application.Users;

public class IntranetDbConnectionSettingsValidator : AbstractValidator<IntranetDbConnectionSettings>
{
	public IntranetDbConnectionSettingsValidator()
	{
		RuleFor(i => i.DbName).NotEmpty();
		RuleFor(i => i.Host).NotEmpty();
		RuleFor(i => i.Password).NotEmpty();
		RuleFor(i => i.User).NotEmpty();
		RuleFor(i => i.Port).NotEmpty().Must(i => i > 1000).WithMessage("Port number must be greater than 1000.");
	}
}