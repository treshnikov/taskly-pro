using FluentValidation;

namespace Taskly.Application.Notes.Commands
{
    public class UpdateNoteCommandValidator : AbstractValidator<UpdateNoteCommand>
    {
        public UpdateNoteCommandValidator()
        {
            RuleFor(updateNoteCommand => updateNoteCommand.Title).NotEmpty().MaximumLength(250);
            RuleFor(updateNoteCommand => updateNoteCommand.UserId).NotEmpty();
            RuleFor(updateNoteCommand => updateNoteCommand.Id).NotEmpty();
        }
    }


}