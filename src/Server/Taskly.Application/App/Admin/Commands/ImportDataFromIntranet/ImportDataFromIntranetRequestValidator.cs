using FluentValidation;

namespace Taskly.Application.Users;

public class ImportDataFromIntranetRequestValidator : AbstractValidator<ImportDataFromIntranetRequest>
{
	public ImportDataFromIntranetRequestValidator()
	{
	}
}