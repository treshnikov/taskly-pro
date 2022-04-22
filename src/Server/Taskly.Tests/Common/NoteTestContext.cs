using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common;
using Taskly.Application.Interfaces;
using Taskly.Domain;
using Taskly.DAL;
using Xunit;

namespace Taskly.Tests;

public static class NoteTestContext
{
    public static Guid UserAId = Guid.NewGuid();
    public static Guid UserBId = Guid.NewGuid();

    public static Guid NoteIdForDelete = Guid.NewGuid();
    public static Guid NoteIdForUpdate = Guid.NewGuid();
    public static IMapper Mapper { get; set; }

    static NoteTestContext()
    {
        var configurationProvider = new MapperConfiguration(conf =>
        {
            conf.AddProfile(new AssemblyMappingProfile(typeof(ITasklyDbContext).Assembly));
        });

        Mapper = configurationProvider.CreateMapper();
    }
    
    public static TasklyDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<TasklyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var context = new TasklyDbContext(options);
        context.Database.EnsureCreated();
        context.Notes.AddRange(
            new Note
            {
                Id = Guid.NewGuid(),
                Details = "Details 1",
                Title = "Title 1",
                CreationDate = DateTime.Today,
                EditTime = null,
                UserId = UserAId
            },
            new Note
            {
                Id = Guid.NewGuid(),
                Details = "Details 2",
                Title = "Title 2",
                CreationDate = DateTime.Today,
                EditTime = null,
                UserId = UserBId
            },
            new Note
            {
                Id = NoteIdForUpdate,
                Details = "Details 3",
                Title = "Title 3",
                CreationDate = DateTime.Today,
                EditTime = null,
                UserId = UserAId
            },
            new Note
            {
                Id = NoteIdForDelete,
                Details = "Details 4",
                Title = "Title 4",
                CreationDate = DateTime.Today,
                EditTime = null,
                UserId = UserAId
            }
        );
        context.SaveChanges();
        return context;
    }

    public static void DestroyNoteDbContext(TasklyDbContext context)
    {
        context.Database.EnsureDeleted();
        context.Dispose();
    }
}