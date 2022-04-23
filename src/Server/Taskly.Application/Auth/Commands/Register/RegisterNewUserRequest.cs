using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Taskly.Application.Auth.Commands.Register
{
    public class RegisterNewUserRequest : IRequest<Guid>
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
    }
}
