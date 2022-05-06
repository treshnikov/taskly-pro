using Taskly.Application.Auth.Consts;
using Taskly.Domain;

namespace Taskly.DAL
{
    public class DbInitializer
    {
        public static void Initialize(TasklyDbContext context)
        {
            var dbHasJustBeenCreated = context.Database.EnsureCreated();

            if (dbHasJustBeenCreated)
            {
                PopulateDefaultUsersAndRoles(context);
            }
        }

        private static void PopulateDefaultUsersAndRoles(TasklyDbContext context)
        {
            var unit = new Unit
            {
                Id = Guid.NewGuid(),
                Name = "System",
                OrderNumber=0,
                ShortName="System"                
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
            context.Units.Add(unit);
            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}