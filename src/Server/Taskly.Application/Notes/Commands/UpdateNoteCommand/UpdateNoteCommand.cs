using MediatR;
using Taskly.Domain;

namespace Taskly.Application.Notes.Commands
{
    public class UpdateNoteCommand : IRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Title { get; set; }
        public string? Details { get; set; }

    }
}