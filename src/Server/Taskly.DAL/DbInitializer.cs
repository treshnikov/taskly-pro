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
            var unit = new Unit
            {
                Id = Guid.NewGuid(),
                Name = "System",
                OrderNumber = 0,
                ShortName = "System"
            };

            var admin = new User
            {
                Name = "admin",
                Email = "admin@admin.com",
                UserUnits = new List<UserUnit>{
                    new UserUnit {
                        Rate = 1,
                        Unit = unit,
                        Comment="admin",
                        UserTitle="admin"
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
                Name = "Default customer"
            };

            var project = new Project
            {
                Id = 1,
                ChiefEngineer = admin,
                ProjectManager = admin,
                Company = unit,
                Customer = customer,
                IsOpened = true,
                Contract = "Contract",
                Name = "Project",
                Start = new DateTime(DateTime.Today.Year, 01, 01),
                End = new DateTime(DateTime.Today.Year, 12, 31),
                Tasks = new List<ProjectTask>
                {
                    new ProjectTask
                    {
                        Description = "Task #1",
                        Start = new DateTime(DateTime.Today.Year, 01, 01),
                        End = new DateTime(DateTime.Today.Year, 12, 31),
                        Estimations = new List<ProjectTaskUnitEstimation>
                        {
                            new ProjectTaskUnitEstimation
                            {
                                Unit = unit,
                                DepartmentHeadHours = 40,
                                EngineerOfTheFirstCategoryHours = 80,
                                EngineerOfTheSecondCategoryHours = 40,
                                EngineerOfTheThirdCategoryHours = 120,
                                LeadEngineerHours = 80,
                            }
                        }

                    },
                    new ProjectTask
                    {
                        Description = "Task #2",
                        Start = new DateTime(DateTime.Today.Year, 01, 01),
                        End = new DateTime(DateTime.Today.Year, 06, 30),
                        Estimations = new List<ProjectTaskUnitEstimation>
                        {
                            new ProjectTaskUnitEstimation
                            {
                                Unit = unit,
                                DepartmentHeadHours = 80,
                                EngineerOfTheFirstCategoryHours = 360,
                                EngineerOfTheSecondCategoryHours = 40
                            }
                        }
                    },
                    new ProjectTask
                    {
                        Description = "Task #3",
                        Start = new DateTime(DateTime.Today.Year, 05, 01),
                        End = new DateTime(DateTime.Today.Year, 10, 30),
                        Estimations = new List<ProjectTaskUnitEstimation>
                        {
                            new ProjectTaskUnitEstimation
                            {
                                Unit = unit,
                                DepartmentHeadHours = 240,
                                EngineerOfTheThirdCategoryHours = 240,
                            }
                        }
                    }
                }
            };

            context.Projects.Add(project);
            context.Customers.Add(customer);
            context.Units.Add(unit);
            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}