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

            var project = new Project{
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
            };

            context.Projects.Add(project);
            context.Customers.Add(customer);
            context.Units.Add(unit);
            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}