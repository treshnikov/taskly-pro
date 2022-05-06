using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Users
{
    public class GetUserRequestHandler : IRequestHandler<GetUserRequest, UserVm>
    {
        private readonly ITasklyDbContext _dbContext;
        private readonly IMapper _mapper;
        public GetUserRequestHandler(ITasklyDbContext dbContext, IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<UserVm> Handle(GetUserRequest request, CancellationToken cancellationToken)
        {
            var user = await _dbContext
                .Users
                .Include(u => u.UserUnits)
                .ThenInclude(u => u.Unit)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);
            
            if (user == null)
            {
                throw new NotFoundException($"User with id {request.UserId} is not found.");
            }

            return await Task.FromResult(UserVm.FromUser(user));
        }
    }
}
