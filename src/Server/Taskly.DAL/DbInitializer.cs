using Taskly.Application.Auth.Consts;
using Taskly.Domain;

namespace Taskly.DAL
{
    public class DbInitializer
    {
        public static void Initialize(TasklyDbContext dbContext)
        {
            var dbHasJustBeenCreated = dbContext.Database.EnsureCreated();

            if (dbHasJustBeenCreated)
            {
                PopulateDefaultRecords(dbContext);
            }
        }

        private static void PopulateDefaultRecords(TasklyDbContext context)
        {
            var dep = new Department
            {
                Id = Guid.NewGuid(),
                Name = "Main department",
                OrderNumber = 0,
                ShortName = "MD"
            };

            var userPosition = new UserPosition{
                Name = "Employee role",
                Ident = "Dev"
            };

            var admin = new User
            {
                Name = "admin",
                Email = "admin@admin.com",
                UserDepartments = new List<UserDepartment>{
                    new UserDepartment {
                        Rate = 1,
                        Department = dep,
                        Comment="admin",
                        UserPosition= userPosition
                    }
                },
                Password = BCrypt.Net.BCrypt.HashPassword("admin"),
                Roles = new[] {
                    new Role
                    {
                        Name = RoleIdents.Admin,
                    }
                }
            };

            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                Name = "Demo customer"
            };

            var project = new Project
            {
                Id = 1,
                ChiefEngineer = admin,
                ProjectManager = admin,
                Company = dep,
                Customer = customer,
                IsOpened = true,
                Contract = "Demo contract",
                Name = "Demo project",
                Start = new DateTime(DateTime.Today.Year, 01, 01),
                End = new DateTime(DateTime.Today.Year, 12, 31),
                Tasks = new List<ProjectTask>
                {
                    new ProjectTask
                    {
                        Description = "Task #1",
                        Start = new DateTime(DateTime.Today.Year, 01, 01),
                        End = new DateTime(DateTime.Today.Year, 12, 31),
                        DepartmentEstimations = new List<ProjectTaskDepartmentEstimation>
                        {
                            new ProjectTaskDepartmentEstimation
                            {
                                Department = dep,
                                Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>
                                {
                                    new ProjectTaskDepartmentEstimationToUserPosition{
                                        Hours = 360,
                                        UserPosition = userPosition
                                    }
                                }
                            }
                        }

                    },
                    new ProjectTask
                    {
                        Description = "Task #2",
                        Start = new DateTime(DateTime.Today.Year, 01, 01),
                        End = new DateTime(DateTime.Today.Year, 06, 30),
                        DepartmentEstimations = new List<ProjectTaskDepartmentEstimation>
                        {
                            new ProjectTaskDepartmentEstimation
                            {
                                Department = dep,
                                Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>
                                {
                                    new ProjectTaskDepartmentEstimationToUserPosition{
                                        Hours = 80,
                                        UserPosition = userPosition
                                    }
                                }
                            }
                        }
                    },
                    new ProjectTask
                    {
                        Description = "Task #3",
                        Start = new DateTime(DateTime.Today.Year, 05, 01),
                        End = new DateTime(DateTime.Today.Year, 10, 30),
                        DepartmentEstimations = new List<ProjectTaskDepartmentEstimation>
                        {
                            new ProjectTaskDepartmentEstimation
                            {
                                Department = dep,
                                Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>
                                {
                                    new ProjectTaskDepartmentEstimationToUserPosition{
                                        Hours = 280,
                                        UserPosition = userPosition
                                    }
                                }
                            }
                        }
                    }
                }
            };

            context.Projects.Add(project);
            context.Customers.Add(customer);
            context.Departments.Add(dep);
            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}