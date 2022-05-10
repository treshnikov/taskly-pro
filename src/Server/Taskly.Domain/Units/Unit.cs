namespace Taskly.Domain
{
    public class Unit
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }     
        public int OrderNumber { get; set; }   
        public Guid? ParentUnitId { get; set; }
        public virtual Unit? ParentUnit { get; set; }
        public ICollection<UserUnit> UserUnits { get; set; }
   }

}