using FluentValidation;

namespace Taskly.Application.Notes.Queries
{
    public class GetNoteListQueryValidator : AbstractValidator<GetNoteListQuery>
    {
        public GetNoteListQueryValidator()
        {
            RuleFor(cmd => cmd.UserId).NotEmpty();
        }
    }

}