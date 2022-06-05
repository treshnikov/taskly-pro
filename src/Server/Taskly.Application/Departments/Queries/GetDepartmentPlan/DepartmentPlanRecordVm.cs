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
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectShortName { get; set; }
        public int ProjectCode { get; set; }
        public List<UserProjectWeekPlanVm> Plans { get; set; }
    }

    public class UserProjectWeekPlanVm
    {
        public DateTime WeekStart { get; set; }
        public int PlannedHours { get; set; }

    }
}