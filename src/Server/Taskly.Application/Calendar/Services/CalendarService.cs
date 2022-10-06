using Taskly.Application.Departments.Queries.GetDepartmentPlan;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Calendar;

public class CalendarService : ICalendarService
{
    private readonly IEnumerable<CalendarDay> _calendar;

    public CalendarService(ITasklyDbContext dbContext)
    {
        _calendar = dbContext.Calendar.ToList();
    }

    public IEnumerable<WeekInfoVm> GetWeeksInfo(UserDepartment user, DateTime start, DateTime end)
    {
        var res = new List<WeekInfoVm>();

        // get non-working days to calculate how many working hours should be planned
        // todo handle sick days
        var nonWorkingDays = _calendar.Where(i => i.Date >= start && i.Date <= end)
            .ToDictionary(i => i.Date, i => i.DayType);

        var dt = start;
        while (dt.DayOfWeek != DayOfWeek.Monday)
        {
            dt = dt.AddDays(1);
        }

        while (dt <= end)
        {
            var day = new WeekInfoVm
            {
                Monday = dt,
                HoursAvailableForPlanning = 40
            };

            if (nonWorkingDays.ContainsKey(dt))
            {
                switch (nonWorkingDays[dt])
                {
                    case CalendarDayType.Holiday: day.HoursAvailableForPlanning -= 8; break;
                    case CalendarDayType.HalfHoliday: day.HoursAvailableForPlanning -= 1; break;
                    default: break;
                }
            }

            day.HoursAvailableForPlanning *= user.Rate;

            if (user.User.HiringDate > dt ||
                (user.User.QuitDate is not null && dt >= user.User.QuitDate))
            {
                day.HoursAvailableForPlanning = 0;
            }

            res.Add(day);
            dt = dt.AddDays(7);
        }

        return res;
    }
}
