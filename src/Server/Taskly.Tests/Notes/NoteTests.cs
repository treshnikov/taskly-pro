using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Notes.Commands;
using Taskly.Application.Notes.Queries;
using Taskly.Tests.Common;
using Shouldly;
using Xunit;

namespace Taskly.Tests.Notes.Commands;

public class NoteTests : TestCommandBase
{
    [Fact]
    public async Task CreateNoteCommandHandler_Success()
    {
        // arrange
        var handler = new CreateNoteCommandHandler(Context);
        var noteTitle = "Note name";
        var noteDetails = "Note details";

        //act
        var noteId = await handler.Handle(
            new CreateNoteCommand
            {
                Details = noteDetails, 
                Title = noteTitle, 
                UserId = NoteTestContext.UserAId
            }, CancellationToken.None);

        // assert
        Assert.NotNull(
            await Context.Notes.SingleOrDefaultAsync(n => 
            n.Id == noteId && n.Title == noteTitle && n.Details == noteDetails));
    }
    
    [Fact]
    public async Task DeleteNoteCommandHandler_Success()
    {
        // arrange
        var handler = new DeleteNoteCommandHandler(Context);

        //act
        await handler.Handle(
            new DeleteNoteCommand
            {
                Id = NoteTestContext.NoteIdForDelete,
                UserId = NoteTestContext.UserAId
            }, CancellationToken.None);

        // assert
        Assert.Null(
            await Context.Notes.FirstOrDefaultAsync(n => 
                n.Id == NoteTestContext.NoteIdForDelete));
    }

    [Fact]
    public async Task DeleteNoteCommandHandler_FailOnWrongUserId()
    {
        // arrange
        var handler = new DeleteNoteCommandHandler(Context);
        
        //act
        // assert
        await Assert.ThrowsAsync<NotFoundException>(async () =>
        {
            await handler.Handle(
                new DeleteNoteCommand
                {
                    Id = NoteTestContext.NoteIdForDelete,
                    UserId = NoteTestContext.UserBId
                }, CancellationToken.None);

        });
    }

    [Fact]
    public async Task UpdateNoteCommandHandler_Success()
    {
        // arrange
        var handler = new UpdateNoteCommandHandler(Context);
        var command = new UpdateNoteCommand
        {
            Id = NoteTestContext.NoteIdForUpdate,
            Details = "111",
            Title = "222",
            UserId = NoteTestContext.UserAId
        };

        // act
        await handler.Handle(command, CancellationToken.None);

        // assert
        Assert.NotNull(await Context.Notes.SingleAsync(i =>
            i.Id == NoteTestContext.NoteIdForUpdate && i.Details == "111" && i.Title == "222" &&
            i.UserId == NoteTestContext.UserAId));
    }
    
    [Fact]
    public async Task UpdateNoteCommandHandler_NotFound()
    {
        // arrange
        var handler = new UpdateNoteCommandHandler(Context);
        var command = new UpdateNoteCommand
        {
            Id = Guid.NewGuid(),
            Details = "111",
            Title = "222",
            UserId = NoteTestContext.UserAId
        };

        // act
        // assert
        await Assert.ThrowsAsync<NotFoundException>(async () =>
        {
            await handler.Handle(command, CancellationToken.None);
            
        });
    }

    [Fact]
    public async Task GetNoteListQueryHandler_Success()
    {
        // arrange
        var handler = new GetNoteListQueryHandler(Context, NoteTestContext.Mapper);
        var query = new GetNoteListQuery{UserId = NoteTestContext.UserAId};
        
        // act 
        var res = await handler.Handle(query, CancellationToken.None);
        
        // assert
        res.ShouldNotBeNull();
        res.Notes!.Count().ShouldBe(3);
    }
}