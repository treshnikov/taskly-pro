using System;
using AutoMapper;
using Taskly.Application.Common;
using Taskly.Application.Interfaces;
using Taskly.DAL;

namespace Taskly.Tests.Common;

public class TestCommandBase : IDisposable
{
    protected readonly TasklyDbContext Context;
    public static IMapper Mapper { get; set; }

    static TestCommandBase()
    {
        var configurationProvider = new MapperConfiguration(conf =>
        {
            conf.AddProfile(new AssemblyMappingProfile(typeof(ITasklyDbContext).Assembly));
        });

        Mapper = configurationProvider.CreateMapper();
    }

    public TestCommandBase()
    {
        Context = TasklyTestContext.CreateDbContext();
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            TasklyTestContext.DestroyTasklyDbContext(Context);
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    ~TestCommandBase()
    {
        Dispose(false);
    }
}