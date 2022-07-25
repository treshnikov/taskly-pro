using AutoMapper;
using Taskly.Application.Common;
using Taskly.Domain;

namespace Taskly.Application.Users
{
    public class UserVm
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Email { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }

        public static UserVm FromUser(User user)
        {
            var res = new UserVm
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name
            };

            var deps = string.Empty;
            var positions = string.Empty;
            if (user.UserDepartments != null)
            {
                for (int i = 0; i < user.UserDepartments.Count; i++)
                {
                    deps += user.UserDepartments.ElementAt(i).Department?.Name;
                    positions += user.UserDepartments.ElementAt(i).UserPosition.Name;
                    if (i != user.UserDepartments.Count - 1)
                    {
                        deps += ", ";
                        positions += ", ";
                    }
                }
            }
            res.Department = deps;
            res.Position = positions;

            return res;
        }
    }
}