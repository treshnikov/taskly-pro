using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskly.Application.Notes.Commands;
using Taskly.Application.Notes.Queries;
using Taskly.WebApi.Models;
using Taskly.WebApi.Controllers;

namespace Taskly.WebApi.Controllers;

[ApiVersion("1.0")]
[ApiVersion("2.0")]
[Produces("application/json")]
[Authorize]
[Route("api/v{version:apiVersion}/[controller]")]
public class NoteController : BaseController
{
    private IMapper _mapper;

    public NoteController(IMapper mapper)
    {
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<NoteLisVm>> GetAll()
    {
        var query = new GetNoteListQuery()
        {
            UserId = UserId
        };

        var res = await Mediator.Send(query);

        return Ok(res);
    }
    
    /// <summary>
    /// Returns note by Id
    /// </summary>
    /// <param name="noteId"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<NoteDetailsVm>> GetAll(Guid noteId)
    {
        var query = new GetNoteDetailsQuery
        {
            UserId = UserId,
            Id = noteId
        };

        var res = await Mediator.Send(query);

        return Ok(res);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateNoteDto createNoteDto)
    {
        var command = _mapper.Map<CreateNoteCommand>(createNoteDto);
        command.UserId = UserId;
        var noteId = await Mediator.Send(command);

        return Ok(noteId);
    }
    
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update([FromBody] UpdateNoteDto updateNoteDto)
    {
        var command = _mapper.Map<UpdateNoteCommand>(updateNoteDto);
        command.UserId = UserId;
        await Mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Delete([FromBody] DeleteNoteDto deleteNoteDto)
    {
        var command = _mapper.Map<DeleteNoteCommand>(deleteNoteDto);
        command.UserId = UserId;
        await Mediator.Send(command);

        return NoContent();
    }

}