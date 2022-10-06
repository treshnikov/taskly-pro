using Taskly.Application.Departments.Queries.GetDepartmentPlan;
using Taskly.Domain;

namespace Taskly.Application.Calendar;

public interface ICalendarService
{
    IEnumerable<WeekInfoVm> GetWeeksInfo(UserDepartment user, DateTime start, DateTime end);
}
