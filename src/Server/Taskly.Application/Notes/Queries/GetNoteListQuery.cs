using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Notes.Queries
{
    public class GetNoteListQuery : IRequest<NoteLisDto>
    {
        public Guid UserId { get; set; }        
    }

    public class GetNoteListQueryHandler : IRequestHandler<GetNoteListQuery, NoteLisDto>
    {
        private readonly ITasklyDbContext _dbContext;
        private IMapper _mapper;

        public GetNoteListQueryHandler(ITasklyDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<NoteLisDto> Handle(GetNoteListQuery request, CancellationToken cancellationToken)
        {
            var notes = await _dbContext.Notes
                .Where(n => n.UserId == request.UserId)
                .ProjectTo<NoteLookupDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken: cancellationToken);

            return new NoteLisDto{Notes = notes};
        }
    }
    
    public class GetNoteListQueryValidator : AbstractValidator<GetNoteListQuery>
    {
        public GetNoteListQueryValidator()
        {
            RuleFor(cmd => cmd.UserId).NotEmpty();
        }
    }

}