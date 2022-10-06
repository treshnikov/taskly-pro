using Taskly.Domain;

namespace Taskly.Application.Departments.Queries.GetDepartmentStatistics
{
    public class DepartmentStatisticsVm
    {
        public List<ProjectStatVm> Projects { get; set; }
        public List<ProjectToDepartmentEstimationVm> Weeks { get; set; }
        public DepartmentStatisticsSummaryVm Summary { get; set; }
    }

    public class DepartmentStatisticsSummaryVm
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public double AvailableHoursForPlanning { get; set; }
        public double HoursPlannedForDepartment { get; set; }
        public double HoursPlannedByHeadOfDepartment { get; set; }
        public double WorkLoadPercentage { get; set; }
        public double ExternalProjectsRateInPercentage { get; set; }
    }

    public class ProjectToDepartmentEstimationVm
    {
        public DateTime WeekStart { get; set; }
        public double ProjectPlannedHours { get; set; }
        public double DepartmentPlannedHours { get; set; }
        public List<ProjectPlanDetailVm> ProjectPlanDetails { get; set; }
        public List<ProjectPlanDetailVm> DepartmentPlanDetails { get; set; }
    }

    public class ProjectPlanDetailVm
    {
        public double Hours { get; set; }
        public string ProjectName { get; set; }
    }

    public class ProjectStatVm
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ProjectType ProjectType { get; set; }
        public double PlannedTaskHoursForDepartment { get; set; }
        public double PlannedTaskHoursByDepartment { get; set; }
        public double DeltaHours { get; set; }
    }
}