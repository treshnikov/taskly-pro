using AutoMapper;
using Taskly.Application.Common;
using Taskly.Application.Notes.Commands;

namespace Taskly.WebApi.Models;

public class DeleteNoteDto : IMapWith<DeleteNoteCommand>
{
    public Guid Id { get; set; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<DeleteNoteDto, DeleteNoteCommand>()
            .ForMember(noteCommand => noteCommand.Id,
                opt => opt.MapFrom((noteDto => noteDto.Id)));

    }

}