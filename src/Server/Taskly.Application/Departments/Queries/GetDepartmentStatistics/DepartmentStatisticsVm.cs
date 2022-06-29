namespace Taskly.Application.Departments.Queries.GetDepartmentStatistics
{
    public class DepartmentStatisticsVm
    {
        public List<ProjectStatVm> Projects { get; set; }
        public List<ProjectToDepartmentEstimationVm> Weeks { get; set; }
    }

    public class ProjectToDepartmentEstimationVm
    {
        public DateTime WeekStart { get; set; }
        public double ProjectPlannedHours { get; set; }
        public double DepartmentPlannedHours { get; set; }
        public List<ProjectPlanDetailVm> ProjectPlanDetails { get; set; }
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
        public double PlannedTaskHoursForDepartment { get; set; }
        public double PlannedTaskHoursByDepartment { get; set; }
        public double DeltaHours { get; set; }
    }
}