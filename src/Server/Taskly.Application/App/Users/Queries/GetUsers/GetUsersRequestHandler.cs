﻿using AutoMapper;
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
                .Include(u => u.UserDepartments).ThenInclude(u => u.Department)
                .Include(u => u.UserDepartments).ThenInclude(u => u.UserPosition)
                .Where(u => u.UserDepartments.Any(ud => ud.Rate > 0))
                .AsNoTracking()
                .OrderBy(u => u.Name)
                .Select(u => UserVm.FromUser(u))
                .ToListAsync(cancellationToken: cancellationToken);
            
            return users;
        }

    }
}
