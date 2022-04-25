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
            var admin = new User
            {
                Name = "admin",
                Email = "admin@admin.com",
                Password = BCrypt.Net.BCrypt.HashPassword("admin"),
                Roles = new[] {
                    new Role
                    {
                        Name = RoleIdents.Admin,
                    }
                }
            };
            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}