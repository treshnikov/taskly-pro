using FluentValidation;

namespace Taskly.Application.Notes.Commands
{
    public class CreateNoteCommandValidator : AbstractValidator<CreateNoteCommand>
    {
        public CreateNoteCommandValidator()
        {
            RuleFor(createNoteCommand => createNoteCommand.Title).NotEmpty().MaximumLength(250);
            RuleFor(createNoteCommand => createNoteCommand.UserId).NotEmpty();
        }
    }
}