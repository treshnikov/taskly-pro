using AutoMapper;
using MediatR;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Notes.Queries
{
    public class GetNoteDetailsQueryHandler : IRequestHandler<GetNoteDetailsQuery, NoteDetailsVm>
    {
        private readonly ITasklyDbContext _dbContext;
        private IMapper _mapper;

        public GetNoteDetailsQueryHandler(ITasklyDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<NoteDetailsVm> Handle(GetNoteDetailsQuery request, CancellationToken cancellationToken)
        {
            var note = await _dbContext.Notes.FindAsync(new object[]{request.Id}, cancellationToken);
            if (note == null)
            {
                throw new NotFoundException($"Note with Id={request.Id} is not found.");
            }

            return _mapper.Map<NoteDetailsVm>(note);
        }
    }

}