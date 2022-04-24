using AutoMapper;
using Taskly.Domain;
using Taskly.Application.Common;

namespace Taskly.Application.Notes.Queries
{
    public class NoteDetailsVm : IMapWith<Note>
    {
        public Guid Id {get; set;}
        public string Title {get; set;}
        public string Details {get; set;}
        public DateTime CreationDate {get; set;}
        public DateTime? EditTime {get; set;}

        public void Mapping(Profile profile)
        {
            profile.CreateMap<Note, NoteDetailsVm>()
                .ForMember(noteVm => noteVm.Title, opt => opt.MapFrom(note => note.Title))         
                .ForMember(noteVm => noteVm.Details, opt => opt.MapFrom(note => note.Details))            
                .ForMember(noteVm => noteVm.Id, opt => opt.MapFrom(note => note.Id))           
                .ForMember(noteVm => noteVm.CreationDate, opt => opt.MapFrom(note => note.CreationDate))            
                .ForMember(noteVm => noteVm.EditTime, opt => opt.MapFrom(note => note.EditTime));            
        }
    }
}