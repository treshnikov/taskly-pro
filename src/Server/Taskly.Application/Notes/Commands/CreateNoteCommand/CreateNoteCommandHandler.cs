using MediatR;
using Taskly.Domain;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Notes.Commands
{
    public class CreateNoteCommandHandler : IRequestHandler<CreateNoteCommand, Guid>
    {
        private readonly ITasklyDbContext _dbContext;
        public CreateNoteCommandHandler(ITasklyDbContext dbContext) : base()
        {
            _dbContext = dbContext;
        }
        public async Task<Guid> Handle(CreateNoteCommand request, CancellationToken cancellationToken)
        {
            var note = new Note(Guid.NewGuid(), request.UserId, request.Title, request.Details, DateTime.UtcNow, null);
            await _dbContext.Notes.AddAsync(note, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return note.Id;
        }
    }
}