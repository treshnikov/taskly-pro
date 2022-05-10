namespace Taskly.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
        public ICollection<Role> Roles { get; set; }
        public ICollection<UserUnit> UserUnits { get; set; }
    }
}