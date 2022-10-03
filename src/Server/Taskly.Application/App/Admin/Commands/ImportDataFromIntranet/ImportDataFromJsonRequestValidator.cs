using FluentValidation;

namespace Taskly.Application.Users
{
    public class ImportDataFromIntranetRequestValidator : AbstractValidator<ImportDataFromIntranetRequest>
    {
        public ImportDataFromIntranetRequestValidator()
        {
            RuleFor(i => i.UsersFileName).NotEmpty();
            RuleFor(i => i.ProjectsFileName).NotEmpty();
            RuleFor(i => i.ProjectTasksFileName).NotEmpty();
        }
    }
}