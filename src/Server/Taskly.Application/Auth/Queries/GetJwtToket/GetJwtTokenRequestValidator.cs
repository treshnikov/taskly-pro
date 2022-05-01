using FluentValidation;

namespace Taskly.WebApi.Controllers
{
    public class GetJwtTokenRequestValidator : AbstractValidator<GetJwtTokenRequest>
    {
        public GetJwtTokenRequestValidator()
        {
            RuleFor(r => r.Email).NotEmpty();
            RuleFor(r => r.Password).NotEmpty();
        }
    }
}
