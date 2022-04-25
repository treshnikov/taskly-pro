using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Taskly.Application.Auth.Queries.GetUsers
{
    public  class GetUsersRequest : IRequest<IEnumerable<UserVm>>
    {
    }
}
