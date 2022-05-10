namespace Taskly.Domain
{
    public class ProjectTaskUnitEstimation
    {
        public Guid Id { get; set; }
        public Unit Unit { get; set; }
        public Guid UnitId { get; set; }

        // todo - move the following set of positions to a separated table if/when needed
        public int DepartmentHeadHours { get; set; }
        public int LeadEngineerHours { get; set; }
        public int EngineerOfTheFirstCategoryHours { get; set; }
        public int EngineerOfTheSecondCategoryHours { get; set; }
        public int EngineerOfTheThirdCategoryHours { get; set; }
    }
}