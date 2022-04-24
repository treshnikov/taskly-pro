using FluentValidation;

namespace Taskly.Application.Auth.Commands.Register
{
    public class RegisterNewUserRequestValidator : AbstractValidator<RegisterNewUserRequest>
    {
        public RegisterNewUserRequestValidator()
        {
            RuleFor(r => r.Name).NotEmpty();
            RuleFor(r => r.Password).NotEmpty();
            RuleFor(r => r.Email).EmailAddress();
        }
    }
}
