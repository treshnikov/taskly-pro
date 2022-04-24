using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Notes.Queries
{
    public class GetNoteListQueryHandler : IRequestHandler<GetNoteListQuery, NoteLisVm>
    {
        private readonly ITasklyDbContext _dbContext;
        private IMapper _mapper;

        public GetNoteListQueryHandler(ITasklyDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<NoteLisVm> Handle(GetNoteListQuery request, CancellationToken cancellationToken)
        {
            var notes = await _dbContext.Notes
                .Where(n => n.UserId == request.UserId)
                .ProjectTo<NoteLookupVm>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken: cancellationToken);

            return new NoteLisVm{Notes = notes};
        }
    }

}