namespace Taskly.Application.Users
{
    internal class IntranetProject
    {
        public int Id { get; set; }
        public string ShortName { get; set; }
        public string Name { get; set; }
        public bool Opened { get; set; }
        public bool Internal { get; set; }
        public int DepartmentId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime? CloseDate { get; set; }
        public int? ManagerId { get; set; }
        public string? ManagerEmail { get; set; }
        public int? LeadEngineerId { get; set; }
        public string? LeadEngineerEmail { get; set; }
        public string CustomerName { get; set; }
        public string? Contract { get; set; }
    }

}