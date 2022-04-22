using System;
using Taskly.DAL;

namespace Taskly.Tests.Common;

public class TestCommandBase : IDisposable
{
    protected readonly TasklyDbContext Context;

    public TestCommandBase()
    {
        Context = NoteTestContext.CreateDbContext();
    }
    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            NoteTestContext.DestroyNoteDbContext(Context);
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