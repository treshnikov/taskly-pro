using MediatR;

namespace Taskly.Application.Notes.Commands
{
    public class CreateNoteCommand : IRequest<Guid>
    {
        public Guid UserId { get; set; }
        public string? Title { get; set; }
        public string? Details { get; set; }
    }
}