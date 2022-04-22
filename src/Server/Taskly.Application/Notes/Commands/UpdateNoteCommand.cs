using FluentValidation;
using MediatR;
using Taskly.Domain;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Notes.Commands
{
    public class UpdateNoteCommand : IRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Title { get; set; }
        public string? Details { get; set; }

    }

    public class UpdateNoteCommandHandler : IRequestHandler<UpdateNoteCommand>
    {
        private readonly ITasklyDbContext _dbContext;
        public UpdateNoteCommandHandler(ITasklyDbContext dbContext) : base()
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(UpdateNoteCommand request, CancellationToken cancellationToken)
        {
            var note = await _dbContext.Notes.FindAsync(new object[]{request.Id}, cancellationToken);
            if (note == null)
            {
                throw new NotFoundException($"Note with Id={request.Id} is not found.");
            }

            note.Title = request.Title;
            note.Details = request.Details;
            note.EditTime = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
    
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