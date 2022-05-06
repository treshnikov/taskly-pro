using AutoMapper;
using Taskly.Application.Common;
using Taskly.Domain;

namespace Taskly.Application.Users
{
    public class UserVm
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Unit { get; set; }

    }
}