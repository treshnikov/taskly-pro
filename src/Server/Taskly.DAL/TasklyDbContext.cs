using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.DAL.EntityTypeConfigurations;
using Taskly.Domain;

namespace Taskly.DAL;

public class TasklyDbContext : DbContext, ITasklyDbContext
{
	public DbSet<User> Users { get; set; }
	public DbSet<Role> Roles { get; set; }
	public DbSet<Department> Departments { get; set; }
	public DbSet<DepartmentPlan> DepartmentPlans { get; set; }
	public DbSet<UserDepartment> UserDepartments { get; set; }
	public DbSet<Customer> Customers { get; set; }
	public DbSet<Project> Projects { get; set; }
	public DbSet<ProjectTask> ProjectTasks { get; set; }
	public DbSet<UserPosition> UserePositions { get; set; }
	public DbSet<ProjectTaskUserPositionEstimation> ProjectTaskUserPositionEstimations { get; set; }
	public DbSet<ProjectTaskEstimation> ProjectTaskEstimations { get; set; }
	public DbSet<CalendarDay> Calendar { get; set; }
	public DbSet<VacationDay> Vacations { get; set; }
	public TasklyDbContext(DbContextOptions<TasklyDbContext> options) : base(options)
	{
	}

	protected override void OnModelCreating(ModelBuilder builder)
	{
		builder.ApplyConfiguration(new NoteConfiguration());

		builder.ApplyConfiguration(new UserConfiguration());
		builder.ApplyConfiguration(new UserPositionConfiguration());
		builder.ApplyConfiguration(new RoleConfiguration());

		builder.ApplyConfiguration(new DepartmentConfiguration());
		builder.ApplyConfiguration(new UserDepartmentConfiguration());

		builder.ApplyConfiguration(new ProjectConfiguration());
		builder.ApplyConfiguration(new ProjectTaskConfiguration());
		builder.ApplyConfiguration(new ProjectTaskEstimationConfiguration());
		builder.ApplyConfiguration(new ProjectTaskUserPositionEstimationConfiguration());
		builder.ApplyConfiguration(new CustomerConfiguration());

		builder.ApplyConfiguration(new CalendarDayConfiguration());
		builder.ApplyConfiguration(new VacationDayConfiguration());

		base.OnModelCreating(builder);
	}

}