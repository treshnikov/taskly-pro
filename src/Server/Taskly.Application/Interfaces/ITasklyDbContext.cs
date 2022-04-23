using Microsoft.EntityFrameworkCore;
using Taskly.Domain;

namespace Taskly.Application.Interfaces
{
    public interface ITasklyDbContext
    {
        DbSet<Note> Notes { get; set; }
        DbSet<User> Users { get; set; }
        DbSet<Role> Roles { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}