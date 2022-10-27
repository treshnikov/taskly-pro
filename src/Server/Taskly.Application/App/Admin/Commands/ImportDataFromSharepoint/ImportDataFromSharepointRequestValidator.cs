using FluentValidation;

namespace Taskly.Application.Users;

public class ImportDataFromSharepointRequestValidator : AbstractValidator<ImportDataFromSharepointRequest>
{
	public ImportDataFromSharepointRequestValidator()
	{
		RuleFor(i => i.ProjectTasksFileName).NotEmpty();
	}
}