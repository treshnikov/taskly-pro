using Taskly.Application.Users;

namespace Taskly.Application.Departments.Queries.GetDepartmentPlan
{
    public class DepartmentPlanRecordVm
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string UserPosition { get; set; }
        public List<UserProjectPlanVm> Projects { get; set; }
    }

    public class UserProjectPlanVm
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectShortName { get; set; }
        public DateTime ProjectStart { get; internal set; }
        public DateTime ProjectEnd { get; internal set; }
        public List<UserProjectWeekPlanVm> Plans { get; set; }
    }

    public class UserProjectWeekPlanVm
    {
        public int WeekNumber { get; internal set; }
        public DateTime WeekStart { get; set; }
        public int PlannedHours { get; set; }
    }
}