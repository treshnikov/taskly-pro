using Taskly.Domain;

namespace Taskly.Application.Calendar;

public interface ICalendarService
{
	IEnumerable<WeekInfo> GetUserWorkingHours(UserDepartment user, DateTime start, DateTime end);
	Task<IEnumerable<DayInfo>> GetUserDaysInfoAsync(string userName, DateTime start, DateTime end, CancellationToken cancellationToken);
	Task<IEnumerable<WeekInfo>> GetDepartmentWorkingHoursAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken);
	Task<double> GetSumOfDepartmentWorkingHoursAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken);
	Task<double> GetSumOfDepartmentHolidaysHoursAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken);
}
