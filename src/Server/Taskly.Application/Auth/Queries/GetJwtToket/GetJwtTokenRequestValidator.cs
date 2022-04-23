using FluentValidation;

namespace Taskly.WebApi.Controllers
{
    public class GetJwtTokenRequestValidator : AbstractValidator<GetJwtTokenRequest>
    {
        public GetJwtTokenRequestValidator()
        {
            RuleFor(r => r.Name).NotEmpty();
            RuleFor(r => r.Password).NotEmpty();
        }
    }
}
