using FluentValidation;

namespace Taskly.Application.Users
{
    public class ImportDataFromJsonRequestValidator : AbstractValidator<ImportDataFromJsonRequest>
    {
        public ImportDataFromJsonRequestValidator()
        {
            RuleFor(i => i.UsersFileName).NotEmpty();
            RuleFor(i => i.DepartmentsFileName).NotEmpty();
            RuleFor(i => i.ProjectsFileName).NotEmpty();
        }
    }
}