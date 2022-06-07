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
                Name = "IT department",
                OrderNumber = 0,
                ShortName = "IT",
                IncludeInWorkPlan = true
            };

            var userPosition = new UserPosition
            {
                Name = "Senior developer",
                Ident = "Dev"
            };

            var admin = new User
            {
                Name = "John Doe",
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
                Name = "MegaFood Gmbh"
            };

            var project = new Project
            {
                Id = 1,
                ChiefEngineer = admin,
                ProjectManager = admin,
                Company = dep,
                Customer = customer,
                IsOpened = true,
                Contract = "Main contract 2022",
                Name = "MegaFood storage automation system",
                Start = new DateTime(DateTime.Today.Year, 01, 01),
                End = new DateTime(DateTime.Today.Year, 12, 31),
                Tasks = new List<ProjectTask>
                {
                    new ProjectTask
                    {
                        Description = "Analyze storage system",
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
                        Description = "Prepare technical statements",
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
                        Description = "Develop software",
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

            var dt = new DateTime(2022, 01, 10);
            for (int i = 0; i < 28; i++)
            {
                var plan = new DepartmentPlan
                {
                    Department = dep,
                    DepartmentId = dep.Id,
                    Hours = 40,
                    Project = project,
                    ProjectId = project.Id,
                    User = admin,
                    UserId = admin.Id,
                    WeekStart = dt,
                };
                context.DepartmentPlans.Add(plan);

                dt = dt.AddDays(7);
            }

            context.Projects.Add(project);
            context.Customers.Add(customer);
            context.Departments.Add(dep);
            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}