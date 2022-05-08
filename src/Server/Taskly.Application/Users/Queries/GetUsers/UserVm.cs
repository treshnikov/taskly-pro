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
        public string Unit { get; set; }
        public string Position { get; set; }

        public static UserVm FromUser(User user)
        {
            var res = new UserVm
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name
            };

            var units = string.Empty;
            var positions = string.Empty;
            if (user.UserUnits != null)
            {
                for (int i = 0; i < user.UserUnits.Count; i++)
                {
                    units += user.UserUnits.ElementAt(i).Unit?.Name;
                    positions += user.UserUnits.ElementAt(i).UserTitle;
                    if (i != user.UserUnits.Count - 1)
                    {
                        units += ", ";
                        positions += ", ";
                    }
                }
            }
            res.Unit = units;
            res.Position = positions;

            return res;
        }
    }
}