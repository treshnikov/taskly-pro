using Microsoft.EntityFrameworkCore;
using Taskly.Application.Departments.Queries.GetDepartmentPlan;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Calendar;

public class CalendarService : ICalendarService
{
    private readonly IEnumerable<CalendarDay> _calendar;
    private readonly ITasklyDbContext _dbContext;

    public CalendarService(ITasklyDbContext dbContext)
    {
        _dbContext = dbContext;
        _calendar = dbContext.Calendar.ToList();
    }

    public async Task<double> GetAvailableHoursForPlanningForDepartmentAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken)
    {
        var res = 0.0;
        var users = await _dbContext
            .Users
            .Include(d => d.UserDepartments)
            .Where(u => u.UserDepartments.Any(ud => ud.DepartmentId == departmentId))
            .ToListAsync(cancellationToken);

        foreach (var user in users)
        {
            // take a department with max work rate because user can work in multiple departments
            var ud = user.UserDepartments.OrderByDescending(i => i.Rate).First();
            var availableHoursForPlanning = GetWeeksInfo(ud, start, end).Select(i => i.HoursAvailableForPlanning).Sum();
            res += availableHoursForPlanning;
        }

        return res;
    }

    public async Task<double[]> GetAvailableHoursForPlanningForDepartmentByWeeksAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken)
    {
        var res = new List<double>();
        
        var users = await _dbContext
            .Users
            .Include(d => d.UserDepartments)
            .Where(u => u.UserDepartments.Any(ud => ud.DepartmentId == departmentId))
            .ToListAsync(cancellationToken);

        foreach (var user in users)
        {
            // take a department with max work rate because user can work in multiple departments
            var ud = user.UserDepartments.OrderByDescending(i => i.Rate).First();
            var userWeeks = GetWeeksInfo(ud, start, end);

            if (res.Count == 0)
            {
                res.AddRange(Enumerable.Repeat<double>(0, userWeeks.Count()));
            }

            var idx = 0;
            foreach (var week in userWeeks)
            {
                res[idx] += week.HoursAvailableForPlanning;

                idx++;
            }
        }

        return res.ToArray();
    }

    public IEnumerable<WeekInfoVm> GetWeeksInfo(UserDepartment user, DateTime start, DateTime end)
    {
        var res = new List<WeekInfoVm>();

        // get non-working days to calculate how many working hours should be planned
        // todo handle sick days
        var nonWorkingDays = _calendar
            .Where(i => i.Date >= start && i.Date <= end)
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
