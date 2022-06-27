namespace Taskly.Application.Departments.Queries.GetDepartmentStatistics
{
    public class DepartmentStatisticsVm
    {
        public List<ProjectStatVm> Projects { get; set; }
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