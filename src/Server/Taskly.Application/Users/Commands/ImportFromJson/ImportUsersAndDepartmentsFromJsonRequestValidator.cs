using FluentValidation;

namespace Taskly.Application.Users
{
    public class ImportUsersAndDepartmentsFromJsonRequestValidator : AbstractValidator<ImportUsersAndDepartmentsFromJsonRequest>
    {
        public ImportUsersAndDepartmentsFromJsonRequestValidator()
        {
            RuleFor(i => i.UsersFileName).NotEmpty();
            RuleFor(i => i.DepartmentsFileName).NotEmpty();
        }
    }
}