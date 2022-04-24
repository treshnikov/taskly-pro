using MediatR;
using Taskly.Application.Notes.Commands;

namespace Taskly.Application.Notes.Queries
{
    public class GetNoteDetailsQuery : IRequest<NoteDetailsVm>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }        
    }

}