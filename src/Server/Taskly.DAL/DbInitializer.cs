namespace Taskly.DAL
{
    public class DbInitializer
    {
        public static void Initialize(TasklyDbContext context)
        {
            context.Database.EnsureCreated();
        }
    }
}