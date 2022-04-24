using AutoMapper;
using Taskly.Domain;
using Taskly.Application.Common;

namespace Taskly.Application.Notes.Queries
{
    public class NoteLookupVm : IMapWith<Note>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Note, NoteLookupVm>()
                .ForMember(noteDto => noteDto.Id, opt => opt.MapFrom(note => note.Id))
                .ForMember(noteDto => noteDto.Title, opt => opt.MapFrom(note => note.Title));
        }
    }
}