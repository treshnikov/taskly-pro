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
        public DbSet<Department> Departments { get; set; }
        public DbSet<DepartmentPlan> DepartmentPlans { get; set; }
        public DbSet<UserDepartment> UserDepartments { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
        public DbSet<UserPosition> UserePositions { get; set; }
        public DbSet<ProjectTaskDepartmentEstimationToUserPosition> ProjectTaskDepartmentEstimationToUserPosition { get; set; }

        public TasklyDbContext(DbContextOptions<TasklyDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new NoteConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new RoleConfiguration());
            builder.ApplyConfiguration(new DepartmentConfiguration());
            builder.ApplyConfiguration(new UserDepartmentConfiguration());
            builder.ApplyConfiguration(new ProjectConfiguration());
            builder.ApplyConfiguration(new CustomerConfiguration());
            builder.ApplyConfiguration(new ProjectTaskConfiguration());
            builder.ApplyConfiguration(new ProjectTaskDepartmentEstimationConfiguration());
            builder.ApplyConfiguration(new UserPositionConfiguration());
            builder.ApplyConfiguration(new ProjectTaskDepartmentEstimationToUserPositionConfiguration());
            base.OnModelCreating(builder);
        }

    }
}