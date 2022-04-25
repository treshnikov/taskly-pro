using MediatR;
using Microsoft.EntityFrameworkCore;
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
            var checkUser = await _dbContext
                .Users
                .AsNoTracking()
                .AnyAsync(u => u.Name == request.Name || u.Email == request.Email, cancellationToken);
            if (checkUser)
            {
                throw new AlreadyExistsException("User already exists.");
            }

            var user = new User
            {
                Name = request.Name,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Email = request.Email,
                Roles = new Role[] { }
            };

            await _dbContext.Users.AddAsync(user, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return user.Id;
        }
    }
}
