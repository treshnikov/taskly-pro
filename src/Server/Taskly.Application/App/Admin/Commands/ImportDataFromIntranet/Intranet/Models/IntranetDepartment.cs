namespace Taskly.Application.Users
{
    public class IntranetDepartment
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public int OrderNumber { get; set; }
    }

}