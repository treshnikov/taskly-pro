namespace Taskly.Application.Projects
{
    public class EstimationVm
    {
        public Guid Id { get; set; }
        public Guid UserPositionId { get; set; }
        public string? UserPositionIdent { get; set; }
        public string UserPositionName { get; set; }
        public int Hours { get; set; }
    }
}