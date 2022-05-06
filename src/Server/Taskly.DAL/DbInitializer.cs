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
                Name = "IT",

            };

            var admin = new User
            {
                Name = "admin",
                Email = "admin@admin.com",
                Unit = unit,
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