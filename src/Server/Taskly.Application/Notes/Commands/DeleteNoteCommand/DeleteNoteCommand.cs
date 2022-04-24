using MediatR;
using Taskly.Domain;

namespace Taskly.Application.Notes.Commands
{
    public class DeleteNoteCommand : IRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
    }

}