using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Auth.Queries.GetUsers
{
    public class GetUsersRequestHandler : IRequestHandler<GetUsersRequest, IEnumerable<UserVm>>
    {
        private readonly ITasklyDbContext _dbContext;
        private readonly IMapper _mapper;

        public GetUsersRequestHandler(ITasklyDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        public async Task<IEnumerable<UserVm>> Handle(GetUsersRequest request, CancellationToken cancellationToken)
        {
            return await _dbContext
                .Users
                .AsNoTracking()
                .ProjectTo<UserVm>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken: cancellationToken);
        }
    }
}
