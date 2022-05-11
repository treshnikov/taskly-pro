using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Taskly.Domain;

namespace Taskly.Application.Interfaces
{
    public interface ITasklyDbContext
    {
        DbSet<Note> Notes { get; set; }
        DbSet<User> Users { get; set; }
        DbSet<Role> Roles { get; set; }
        DbSet<Unit> Units { get; set; }
        DbSet<UserUnit> UserUnits { get; set; }
        DatabaseFacade Database { get; }
        DbSet<Customer> Customers { get; set; }
        DbSet<Project> Projects { get; set; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}