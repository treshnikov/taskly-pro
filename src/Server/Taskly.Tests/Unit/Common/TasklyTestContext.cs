using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common;
using Taskly.Application.Interfaces;
using Taskly.Domain;
using Taskly.DAL;
using Xunit;

namespace Taskly.Tests;

public static class TasklyTestContext
{
    public static TasklyDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<TasklyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var context = new TasklyDbContext(options);
        context.Database.EnsureCreated();

        DbInitializer.PopulateDefaultRecords(context);
        return context;
    }

    public static void DestroyTasklyDbContext(TasklyDbContext context)
    {
        context.Database.EnsureDeleted();
        context.Dispose();
    }
}