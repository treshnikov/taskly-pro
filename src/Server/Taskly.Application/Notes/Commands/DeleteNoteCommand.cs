using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Domain;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Notes.Commands
{
    public class DeleteNoteCommand : IRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
    }

    public class DeleteNoteCommandHandler : IRequestHandler<DeleteNoteCommand>
    {
        private ITasklyDbContext _dbContext;
        public DeleteNoteCommandHandler(ITasklyDbContext dbContext) : base()
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(DeleteNoteCommand request, CancellationToken cancellationToken)
        {
            var note = await _dbContext.Notes.FirstOrDefaultAsync(i => i.Id == request.Id && i.UserId == request.UserId, cancellationToken);
            if (note == null)
            {
                throw new NotFoundException($"Note with Id={request.Id} is not found.");
            }

            _dbContext.Notes.Remove(note);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

    public class DeleteNoteCommandValidator : AbstractValidator<DeleteNoteCommand>
    {
        public DeleteNoteCommandValidator()
        {
            RuleFor(updateNoteCommand => updateNoteCommand.UserId).NotEmpty();
            RuleFor(updateNoteCommand => updateNoteCommand.Id).NotEmpty();
        }
    }

}