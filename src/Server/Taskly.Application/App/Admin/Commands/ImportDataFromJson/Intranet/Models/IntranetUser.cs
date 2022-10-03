namespace Taskly.Application.Users
{
    internal class IntranetUser
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int DepartmentId { get; set; }
        public string Title { get; set; }
        public double TimeRate { get; set; }
    }

}