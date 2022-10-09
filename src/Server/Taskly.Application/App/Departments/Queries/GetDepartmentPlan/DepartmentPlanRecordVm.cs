namespace Taskly.Application.Departments.Queries.GetDepartmentPlan
{
    public class DepartmentPlanRecordVm
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string UserPosition { get; set; }
        public double Rate { get; set; }
        public DateTime? QuitDate { get; set; }
        public DateTime HiringDate { get; set; }
        public List<TaskPlanVm> Tasks { get; set; }
        public IEnumerable<WeekInfoVm> Weeks { get; set; }
    }

    public class WeekInfoVm
    {
        public DateTime Monday { get; set; }
        public double HoursAvailableForPlanning { get; set; }
    }

    public class TaskPlanVm
    {
        public int ProjectId { get; set; }
        public Guid ProjectTaskId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectShortName { get; set; }
        public string TaskName { get; set; }
        public DateTime TaskStart { get; internal set; }
        public DateTime TaskEnd { get; internal set; }
        public List<UserProjectWeekPlanVm> Plans { get; set; }
    }

    public class UserProjectWeekPlanVm
    {
        public int WeekNumber { get; internal set; }
        public DateTime WeekStart { get; set; }
        public double PlannedHours { get; set; }
        public bool IsWeekAvailableForPlanning { get; set; }
    }
}