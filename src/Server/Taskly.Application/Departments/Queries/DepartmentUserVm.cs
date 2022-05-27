namespace Taskly.Application.Departments.Queries
{
    public enum DepartmentUserType
    {
        Department,
        User
    }

    public class DepartmentUserVm
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public bool EnabledForPlanning { get; set; }
        public DepartmentUserType Type { get; set; }
        public List<DepartmentUserVm>? Children { get; set; }
    }
}