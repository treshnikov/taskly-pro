using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.DAL.EntityTypeConfigurations;
using Taskly.Domain;

namespace Taskly.DAL
{
    public class TasklyDbContext : DbContext, ITasklyDbContext
    {
        public DbSet<Note> Notes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Unit> Units { get; internal set; }

        public TasklyDbContext(DbContextOptions<TasklyDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new NoteConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new RoleConfiguration());
            builder.ApplyConfiguration(new UnitConfiguration());
            base.OnModelCreating(builder);
        }

    }
}