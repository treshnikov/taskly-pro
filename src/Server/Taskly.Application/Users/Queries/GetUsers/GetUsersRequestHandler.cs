using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Users
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
            var users = await _dbContext
                .Users
                .Include(u => u.UserUnits).ThenInclude(u => u.Unit)
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken);
            
            return UsersToDto(users);
        }

        private static IEnumerable<UserVm> UsersToDto(List<User> users)
        {
            var res = new List<UserVm>();
            foreach(var u in users)
            {
                var dto = new UserVm
                {
                    Id = u.Id,
                    Email = u.Email,
                    Name = u.Name,
                };

                if (u.UserUnits == null)
                {
                    continue;
                }

                var units = string.Empty;
                foreach (var uu in u.UserUnits)
                {
                    units += uu.Unit?.Name + " ";
                }

                dto.Unit = units;
                res.Add(dto);
            }
            return res;
        }
    }
}
