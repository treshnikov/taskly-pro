namespace Taskly.Application.Units.Queries
{
    public class UnitVm
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }

        public List<UnitVm>? Children { get; set; }
    }
}