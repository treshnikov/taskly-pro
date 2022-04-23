﻿using MediatR;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Auth.Commands.Register
{
    public class RegisterNewUserRequestHandler : IRequestHandler<RegisterNewUserRequest, Guid>
    {
        private readonly ITasklyDbContext _dbContext;

        public RegisterNewUserRequestHandler(ITasklyDbContext dbContext)
        {
            this._dbContext = dbContext;
        }
        public async Task<Guid> Handle(RegisterNewUserRequest request, CancellationToken cancellationToken)
        {
            var checkUser = _dbContext.Users.Any(u => u.Name == request.Name || u.Email == request.Email);
            if (checkUser)
            {
                throw new AlreadyExistsException("User already exists.");
            }

            var defaultRoles = await GetDefaultRolesAsync(cancellationToken);
            var user = new User
            {
                Name = request.Name,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Email = request.Email,
                Roles = new List<Role>(defaultRoles)
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return user.Id;
        }

        private async Task<IEnumerable<Role>> GetDefaultRolesAsync(CancellationToken cancellationToken)
        {
            var userRole = _dbContext.Roles.FirstOrDefault(i => i.Name == "User");
            if (userRole == null)
            {
                userRole = new Role
                {
                    Name = "User",
                };
                _dbContext.Roles.Add(userRole);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }

            return new List<Role> { userRole };
        }
    }
}
