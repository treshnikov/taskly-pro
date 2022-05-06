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

        public static UserVm FromUser(User user)
        {
            var res = new UserVm();
            res.Id = user.Id;
            res.Email = user.Email;
            res.Name = user.Name;

            var units = string.Empty;
            if (user.UserUnits != null)
            {
                foreach (var uu in user.UserUnits)
                {
                    units += uu.Unit?.Name + " ";
                }
            }
            res.Unit = units;

            return res;
        }
    }
}