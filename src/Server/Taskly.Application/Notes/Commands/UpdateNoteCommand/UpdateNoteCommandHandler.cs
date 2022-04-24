using MediatR;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Notes.Commands
{
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


}