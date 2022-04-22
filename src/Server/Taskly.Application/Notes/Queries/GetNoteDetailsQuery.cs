using AutoMapper;
using FluentValidation;
using MediatR;
using Taskly.Application.Notes.Commands;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Notes.Queries
{
    public class GetNoteDetailsQuery : IRequest<NoteDetailsDto>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }        
    }

    public class GetNoteDetailsQueryHandler : IRequestHandler<GetNoteDetailsQuery, NoteDetailsDto>
    {
        private readonly ITasklyDbContext _dbContext;
        private IMapper _mapper;

        public GetNoteDetailsQueryHandler(ITasklyDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<NoteDetailsDto> Handle(GetNoteDetailsQuery request, CancellationToken cancellationToken)
        {
            var note = await _dbContext.Notes.FindAsync(new object[]{request.Id}, cancellationToken);
            if (note == null)
            {
                throw new NotFoundException($"Note with Id={request.Id} is not found.");
            }

            return _mapper.Map<NoteDetailsDto>(note);
        }
    }
    
    public class GetNoteDetailsQueryValidator : AbstractValidator<GetNoteDetailsQuery>
    {
        public GetNoteDetailsQueryValidator()
        {
            RuleFor(cmd => cmd.UserId).NotEmpty();
            RuleFor(cmd => cmd.Id).NotEmpty();
        }
    }

}