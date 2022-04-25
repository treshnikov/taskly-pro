using AutoMapper;
using Taskly.Application.Common;
using Taskly.Domain;

namespace Taskly.Application.Auth.Queries.GetUsers
{
    public class UserVm : IMapWith<User>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<User, UserVm>()
                .ForMember(u => u.Id, u => u.MapFrom(u => u.Id))
                .ForMember(u => u.Name, u => u.MapFrom(u => u.Name))
                .ForMember(u => u.Email, u => u.MapFrom(u => u.Email));
        }

    }
}