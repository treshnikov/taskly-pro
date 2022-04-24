using FluentValidation;

namespace Taskly.Application.Notes.Queries
{
    public class GetNoteDetailsQueryValidator : AbstractValidator<GetNoteDetailsQuery>
    {
        public GetNoteDetailsQueryValidator()
        {
            RuleFor(cmd => cmd.UserId).NotEmpty();
            RuleFor(cmd => cmd.Id).NotEmpty();
        }
    }

}