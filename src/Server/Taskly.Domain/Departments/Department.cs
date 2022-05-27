namespace Taskly.Domain
{
    public class Department
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }     
        public int OrderNumber { get; set; }
        public int? Code { get; set; }
        public bool EnabledForPlanning { get; set; }   
        public Guid? ParentDepartmentId { get; set; }
        public virtual Department? ParentDepartment { get; set; }
        public ICollection<UserDepartment> UserDepartments { get; set; }
   }

}