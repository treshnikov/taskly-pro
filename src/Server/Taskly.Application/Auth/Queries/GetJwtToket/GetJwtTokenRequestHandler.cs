﻿using MediatR;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;
using Taskly.Application.Jwt;
using Taskly.Domain;

namespace Taskly.WebApi.Controllers
{
    public class GetJwtTokenRequestHandler : IRequestHandler<GetJwtTokenRequest, string>
    {
        private readonly ITasklyDbContext _dbContext;
        private readonly IJwtGenerator _jwtGenerator;

        public GetJwtTokenRequestHandler(ITasklyDbContext  dbContext, IJwtGenerator jwtGenerator)
        {
            this._dbContext = dbContext;
            this._jwtGenerator = jwtGenerator;
        }
        public Task<string> Handle(GetJwtTokenRequest request, CancellationToken cancellationToken)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Name == request.Name);
            if (user == null)
            {
                throw new NotFoundException($"User {request.Name} cannot be found.");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new ForbiddenException("Authentication error.");
            }

            return Task.FromResult(_jwtGenerator.CreateToken(user));
        }
    }
}
