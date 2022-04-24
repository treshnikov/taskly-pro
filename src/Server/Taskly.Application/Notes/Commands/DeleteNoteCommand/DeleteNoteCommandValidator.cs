using FluentValidation;

namespace Taskly.Application.Notes.Commands
{
    public class DeleteNoteCommandValidator : AbstractValidator<DeleteNoteCommand>
    {
        public DeleteNoteCommandValidator()
        {
            RuleFor(updateNoteCommand => updateNoteCommand.UserId).NotEmpty();
            RuleFor(updateNoteCommand => updateNoteCommand.Id).NotEmpty();
        }
    }

}