using MediatR;

namespace Taskly.Application.Notes.Queries
{
    public class GetNoteListQuery : IRequest<NoteLisVm>
    {
        public Guid UserId { get; set; }        
    }

}