using Taskly.Application.Departments.Queries.GetDepartmentPlan;
using Taskly.Domain;

namespace Taskly.Application.Calendar;

public interface ICalendarService
{
    IEnumerable<WeekInfoVm> GetUserWorkingHours(UserDepartment user, DateTime start, DateTime end);
    Task<IEnumerable<WeekInfoVm>> GetDepartmentWorkingHoursAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken);
    Task<double> GetSumOfDepartmentWorkingHoursAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken);
}
