using Taskly.Application.Auth.Consts;
using Taskly.Domain;

namespace Taskly.DAL
{
    public static class DbInitializer
    {
        public static void Initialize(TasklyDbContext dbContext)
        {
            var dbHasJustBeenCreated = dbContext.Database.EnsureCreated();

            if (dbHasJustBeenCreated)
            {
                try
                {
                    PopulateDefaultRecords(dbContext);
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }

        public static void PopulateDefaultRecords(TasklyDbContext context)
        {
            var itDep = new Department
            {
                Id = Guid.NewGuid(),
                Name = "IT department",
                OrderNumber = 0,
                ShortName = "IT",
                IncludeInWorkPlan = true
            };

            var qaDep = new Department
            {
                Id = Guid.NewGuid(),
                Name = "QA department",
                OrderNumber = 0,
                ShortName = "QA",
                IncludeInWorkPlan = true
            };

            var devOpsDep = new Department
            {
                Id = Guid.NewGuid(),
                Name = "DevOps department",
                OrderNumber = 0,
                ShortName = "DevOps",
                IncludeInWorkPlan = true
            };

            var analyticsDep = new Department
            {
                Id = Guid.NewGuid(),
                Name = "Analytics department",
                OrderNumber = 0,
                ShortName = "Analytics",
                IncludeInWorkPlan = true
            };

            context.Departments.Add(itDep);
            context.Departments.Add(qaDep);
            context.Departments.Add(analyticsDep);
            context.Departments.Add(devOpsDep);

            var departments = new[] { itDep, qaDep, analyticsDep, devOpsDep };

            var seniorDev = new UserPosition
            {
                Name = "Senior developer",
                Ident = "Sen. Dev"
            };

            var dev = new UserPosition
            {
                Name = "Developer",
                Ident = "Dev"
            };

            var junDev = new UserPosition
            {
                Name = "Junior developer",
                Ident = "Jun"
            };

            var seniorQa = new UserPosition
            {
                Name = "Senior QA",
                Ident = "Sen. QA"
            };

            var qa = new UserPosition
            {
                Name = "QA",
                Ident = "QA"
            };

            var junQa = new UserPosition
            {
                Name = "Junior QA",
                Ident = "Jun. QA"
            };

            var seniorA = new UserPosition
            {
                Name = "Senior analytics",
                Ident = "Sen. Al"
            };

            var analytics = new UserPosition
            {
                Name = "Analytics",
                Ident = "Al"
            };

            var junAnalytics = new UserPosition
            {
                Name = "Junior analytics",
                Ident = "Jun. Al"
            };

            var seniorDevOps = new UserPosition
            {
                Name = "Senior DevOps",
                Ident = "Sen. DevOps"
            };

            var devOps = new UserPosition
            {
                Name = "DevOps",
                Ident = "DevOps"
            };

            var junDevOps = new UserPosition
            {
                Name = "Junior DevOps",
                Ident = "Jun DevOps"
            };

            var createUser = User (string name, UserPosition pos, Department dep, bool isAdmin) =>
            {
                var email = name.Split(" ")[0].ToLower() + "@admin.com";
                var res = new User
                {
                    Id = Guid.NewGuid(),
                    Name = name,
                    Email = email,
                    UserDepartments = new List<UserDepartment>{
                    new UserDepartment {
                        Rate = 1,
                        Department = dep,
                        Comment = pos.Ident,
                        UserPosition = pos
                    }
                },
                    Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Roles = isAdmin
                        ? new[] { new Role { Name = RoleIdents.Admin } }
                        : Array.Empty<Role>()
                };

                context.Users.Add(res);
                return res;
            };

            var admin = createUser("admin", seniorDev, itDep, true);
            admin.Password = BCrypt.Net.BCrypt.HashPassword("admin");

            var dev1 = createUser("Legolas", seniorDev, itDep, false);
            var dev2 = createUser("Aragorn", dev, itDep, false);
            var dev3 = createUser("Arwen", dev, itDep, false);
            var dev4 = createUser("Galadriel", junDev, itDep, false);

            var qa1 = createUser("Frodo Baggins", seniorQa, qaDep, false);
            var qa2 = createUser("Samwise Gamgee", qa, qaDep, false);
            var qa3 = createUser("Merrie", junQa, qaDep, false);
            var qa4 = createUser("Pippin", junQa, qaDep, false);

            var al1 = createUser("Boromir", seniorA, analyticsDep, false);
            var al2 = createUser("Eowyn", analytics, analyticsDep, false);
            var al3 = createUser("Bilbo Baggins", junAnalytics, analyticsDep, false);

            var devOps1 = createUser("Theoden", seniorDevOps, devOpsDep, false);
            var devOps2 = createUser("Elrond", devOps, devOpsDep, false);
            var devOps3 = createUser("Gimli", devOps, devOpsDep, false);
            var devOps4 = createUser("Gollum", junDevOps, devOpsDep, false);

            var users = new List<User>
            {
                dev1,
                dev2,
                dev3,
                dev4,
                qa1,
                qa2,
                qa3,
                qa4,
                al1,
                al2,
                al3,
                devOps1,
                devOps2,
                devOps3,
                devOps4
            };

            var customer1 = new Customer
            {
                Id = Guid.NewGuid(),
                Name = "Rivendell Gmbh"
            };
            context.Customers.Add(customer1);

            var rand = new Random();

            var createProject = Project (string name, string shortName) =>
            {
                var projStart = new DateTime(DateTime.Today.Year, 01, 01);
                var task1Start = projStart;
                var task2Start = task1Start.AddDays(rand.Next(20, 30));
                var task3Start = task2Start.AddDays(rand.Next(20, 30));
                var task4Start = task3Start.AddDays(rand.Next(20, 30));

                var project = new Project
                {
                    Id = rand.Next(32768),
                    ChiefEngineer = admin,
                    ProjectManager = admin,
                    Type = ProjectType.External,
                    Company = itDep,
                    Customer = customer1,
                    IsOpened = true,
                    Contract = "Main contract",
                    Name = name,
                    ShortName = shortName,
                    Start = projStart,
                    End = projStart.AddDays(rand.Next(220, 365)),
                    Tasks = new List<ProjectTask>()
                };

                var getEstimations = List<ProjectTaskDepartmentEstimation> () => new List<ProjectTaskDepartmentEstimation>
                {
                    new ProjectTaskDepartmentEstimation
                    {
                        Department = analyticsDep,
                        Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>
                        {
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 360 + rand.Next(0, 120),
                                UserPosition = seniorA
                            },

                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 180 + rand.Next(0, 120),
                                UserPosition = analytics
                            },

                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 80 + rand.Next(0, 120),
                                UserPosition = junAnalytics
                            },
                        }
                    },

                    new ProjectTaskDepartmentEstimation
                    {
                        Department = itDep,
                        Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>
                        {
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 360 + rand.Next(0, 120),
                                UserPosition = seniorDev
                            },
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 200 + rand.Next(0, 120),
                                UserPosition = dev
                            },
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 40 + rand.Next(0, 120),
                                UserPosition = junDev
                            },
                        }
                    },

                    new ProjectTaskDepartmentEstimation
                    {
                        Department = qaDep,
                        Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>
                        {
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 360 + rand.Next(0, 120),
                                UserPosition = seniorQa
                            },
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 200 + rand.Next(0, 120),
                                UserPosition = qa
                            },
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 40 + rand.Next(0, 120),
                                UserPosition = junQa
                            },
                        }
                    },

                    new ProjectTaskDepartmentEstimation
                    {
                        Department = devOpsDep,
                        Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>
                        {
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 360 + rand.Next(0, 120),
                                UserPosition = seniorDevOps
                            },
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 200 + rand.Next(0, 120),
                                UserPosition = devOps
                            },
                            new ProjectTaskDepartmentEstimationToUserPosition{
                                Hours = 40 + rand.Next(0, 120),
                                UserPosition = junDevOps
                            },
                        }
                    }
                };

                project.Tasks.Add(new ProjectTask
                {
                    Description = "Analyze requirements",
                    Start = task1Start,
                    End = task1Start.AddDays(rand.Next(60, 120)),
                    DepartmentEstimations = getEstimations()
                });

                project.Tasks.Add(new ProjectTask
                {
                    Description = "Prepare technical statements",
                    Start = task2Start,
                    End = task2Start.AddDays(rand.Next(60, 120)),
                    DepartmentEstimations = getEstimations()

                });

                project.Tasks.Add(new ProjectTask
                {
                    Description = "Develop software",
                    Start = task3Start,
                    End = task3Start.AddDays(rand.Next(60, 120)),
                    DepartmentEstimations = getEstimations()
                });

                project.Tasks.Add(new ProjectTask
                {
                    Description = "Delivery and support",
                    Start = task4Start,
                    End = task4Start.AddDays(rand.Next(60, 120)),
                    DepartmentEstimations = getEstimations()
                });

                project.End = project.Tasks.Max(i => i.End).AddDays(20);
                context.Projects.Add(project);
                return project;
            };

            var projectNames = new string[] {
                "A Long-expected Party System",
                "The Shadow of the Past",
                "Three is Company",
                "A Short Cut to Mushrooms",
                "A Conspiracy Unmasked",
                "The Old Forest",
                "In the House of Tom Bombadil",
                "Fog on the Barrow-downs",
                "At the Sign of the Prancing Pony",
                "Strider",
                "A Knife in the Dark",
                "Flight to the Ford"
            };

            var projects = new List<Project>();
            projects.AddRange(projectNames.Select(i => createProject(i, i)));

            foreach (var user in users)
            {
                var randomProjects = new List<Project>();
                while (randomProjects.Count != 3)
                {
                    var idx = rand.Next(1, projects.Count) - 1;
                    var p = projects[idx];
                    if (!randomProjects.Contains(p))
                    {
                        randomProjects.Add(p);
                    }
                }

                var dt = new DateTime(DateTime.Today.Year, 1, 1);
                var end = new DateTime(DateTime.Today.Year, 12, 31);
                while (dt.DayOfWeek != DayOfWeek.Monday)
                {
                    dt = dt.AddDays(1);
                }

                while (dt <= end)
                {
                    var sumHours = 0;
                    foreach (var project in randomProjects)
                    {
                        var hours = rand.Next(10, 18);
                        sumHours += hours;

                        if (sumHours > 40)
                        {
                            hours -= sumHours - 40;
                        }

                        var plan = new DepartmentPlan
                        {
                            Department = user.UserDepartments.First().Department,
                            DepartmentId = user.UserDepartments.First().Department.Id,
                            Hours = hours,
                            Project = project,
                            ProjectId = project.Id,
                            User = user,
                            UserId = user.Id,
                            WeekStart = dt,
                        };
                        context.DepartmentPlans.Add(plan);
                    }
                    dt = dt.AddDays(7);
                }
            }

            context.SaveChanges();
        }
    }
}