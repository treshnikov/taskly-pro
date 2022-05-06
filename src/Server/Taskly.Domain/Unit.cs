namespace Taskly.Domain
{
    public class Unit
    {
        public Guid Id { get; set; }
        public string Name { get; set; }        
        public Guid? ParentUnitId { get; set; }
        public virtual Unit? ParentUnit { get; set; }
   }

}