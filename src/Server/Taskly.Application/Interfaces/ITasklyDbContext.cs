using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Taskly.Domain;

namespace Taskly.Application.Interfaces;

public interface ITasklyDbContext
{
	DbSet<User> Users { get; set; }
	DbSet<Role> Roles { get; set; }
	DbSet<Department> Departments { get; set; }
	DbSet<DepartmentPlan> DepartmentPlans { get; set; }
	DbSet<UserDepartment> UserDepartments { get; set; }
	DbSet<UserPosition> UserePositions { get; set; }
	DatabaseFacade Database { get; }
	DbSet<Customer> Customers { get; set; }
	DbSet<Project> Projects { get; set; }
	DbSet<ProjectTask> ProjectTasks { get; set; }
	DbSet<ProjectTaskEstimation> ProjectTaskEstimations { get; set; }
	DbSet<ProjectTaskUserPositionEstimation> ProjectTaskUserPositionEstimations { get; set; }
	DbSet<CalendarDay> Calendar { get; set; }
	DbSet<VacationDay> Vacations { get; set; }
	Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}