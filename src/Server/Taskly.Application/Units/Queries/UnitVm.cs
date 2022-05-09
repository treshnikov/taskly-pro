namespace Taskly.Application.Units.Queries
{
    public enum UnitUserType
    {
        Unit,
        User
    }

    public class UnitUserVm
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public UnitUserType Type { get; set; }
        public List<UnitUserVm>? Children { get; set; }
    }
}