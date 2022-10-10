using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Departments.Queries.GetDepartmentPlan;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Calendar;

public class CalendarService : ICalendarService
{
    private readonly IEnumerable<CalendarDay> _calendar;
    private readonly HashSet<Tuple<Guid, DateTime>> _vacations;
    private readonly ITasklyDbContext _dbContext;

    public CalendarService(ITasklyDbContext dbContext)
    {
        _dbContext = dbContext;
        _calendar = dbContext.Calendar.ToList();
        _vacations = new HashSet<Tuple<Guid, DateTime>>(_dbContext.Vacations.Select(i => new Tuple<Guid, DateTime>(i.UserId, i.Date)));
    }

    public async Task<double> GetSumOfDepartmentWorkingHoursAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken)
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
            var availableHoursForPlanning = GetUserWorkingHours(ud, start, end).Select(i => i.HoursAvailableForPlanning).Sum();
            res += availableHoursForPlanning;
        }

        return res;
    }

    public async Task<IEnumerable<WeekInfo>> GetDepartmentWorkingHoursAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken)
    {
        var res = new List<WeekInfo>();

        var users = await _dbContext
            .Users
            .Include(d => d.UserDepartments)
            .Where(u => u.UserDepartments.Any(ud => ud.DepartmentId == departmentId))
            .ToListAsync(cancellationToken);

        foreach (var user in users)
        {
            // take a department with max work rate because user can work in multiple departments
            var ud = user.UserDepartments.OrderByDescending(i => i.Rate).First();
            var userWeeks = GetUserWorkingHours(ud, start, end);

            if (res.Count == 0)
            {
                foreach (var w in userWeeks)
                {
                    res.Add(new WeekInfo { Monday = w.Monday, HoursAvailableForPlanning = 0 });
                }
            }

            var idx = 0;
            foreach (var week in userWeeks)
            {
                res[idx].HoursAvailableForPlanning += week.HoursAvailableForPlanning;

                idx++;
            }
        }

        return res;
    }

    public IEnumerable<WeekInfo> GetUserWorkingHours(UserDepartment userDep, DateTime start, DateTime end)
    {
        var res = new List<WeekInfo>();

        // get non-working days to calculate how many working hours should be planned
        // todo handle sick days
        var nonWorkingDays = _calendar
            .Where(i =>
                (i.DayType == CalendarDayType.Holiday || i.DayType == CalendarDayType.HalfHoliday) &&
                i.Date >= start && i.Date <= end)
            .ToDictionary(i => i.Date, i => i.DayType);

        var workDays = new HashSet<DateTime>(_calendar
            .Where(i =>
                i.DayType == CalendarDayType.WorkDay &&
                i.Date >= start && i.Date <= end)
            .Select(i => i.Date));

        var dt = start;
        while (dt.DayOfWeek != DayOfWeek.Monday)
        {
            dt = dt.AddDays(1);
        }

        while (dt <= end)
        {
            var weekInfo = new WeekInfo
            {
                Monday = dt,
                HoursAvailableForPlanning = 40
            };

            // todo handle working weekends
            var monday = weekInfo.Monday;
            var workDaysOfWeek = new List<DateTime>{
                monday, monday.AddDays(1), monday.AddDays(2), monday.AddDays(3), monday.AddDays(4)
            };
            var weekends = new List<DateTime>{
                monday.AddDays(5), monday.AddDays(6)
            };

            foreach (var workDay in workDaysOfWeek)
            {
                // vacations
                if (_vacations.Contains(new Tuple<Guid, DateTime>(userDep.User.Id, workDay)))
                {
                    weekInfo.HoursAvailableForPlanning -= 8;
                }

                // handle holidays
                else if (nonWorkingDays.ContainsKey(workDay))
                {
                    switch (nonWorkingDays[workDay])
                    {
                        case CalendarDayType.Holiday: weekInfo.HoursAvailableForPlanning -= 8; break;
                        case CalendarDayType.HalfHoliday: weekInfo.HoursAvailableForPlanning -= 1; break;
                        default: break;
                    }
                }
            }

            foreach (var weekend in weekends)
            {
                // vacations
                if (_vacations.Contains(new Tuple<Guid, DateTime>(userDep.User.Id, weekend)))
                {
                    continue;
                }

                // handle work days on weekends
                else if (workDays.Contains(weekend))
                {
                    weekInfo.HoursAvailableForPlanning += 8;
                }
            }

            weekInfo.HoursAvailableForPlanning *= userDep.Rate;

            if (userDep.User.HiringDate > dt ||
                (userDep.User.QuitDate is not null && dt >= userDep.User.QuitDate))
            {
                weekInfo.HoursAvailableForPlanning = 0;
            }

            res.Add(weekInfo);
            dt = dt.AddDays(7);
        }

        return res;
    }

    public async Task<double> GetSumOfDepartmentHolidaysHoursAsync(Guid departmentId, DateTime start, DateTime end, CancellationToken cancellationToken)
    {
        var res = 0.0;
        var users = await _dbContext
            .Users
            .Include(d => d.UserDepartments)
            .Where(u => u.UserDepartments.Any(ud => ud.DepartmentId == departmentId))
            .ToListAsync(cancellationToken);

        var dt = start;
        while (dt < end)
        {
            foreach (var user in users)
            {
                var rate = user.UserDepartments.OrderByDescending(i => i.Rate).First().Rate;
                if (_vacations.Contains(new Tuple<Guid, DateTime>(user.Id, dt)))
                {
                    res += 8 * rate;
                }
            }
            dt = dt.AddDays(1);
        }

        return res;
    }

    public async Task<IEnumerable<DayInfo>> GetUserDaysInfoAsync(string userName, DateTime start, DateTime end, CancellationToken cancellationToken)
    {
        var res = new List<DayInfo>();
        var days = await _dbContext
            .Calendar
            .Where(i => i.Date >= start && i.Date <= end)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        // todo - replace userName to user Id
        var name = string.Join(" ", userName.Split(' ').Take(3));
        var dbUser = _dbContext.Users.First(u => u.Name == name);

        var vacations = await _dbContext
            .Vacations
            .Where(i => i.UserId == dbUser.Id && i.Date >= start && i.Date <= end)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        foreach (var v in vacations)
        {
            var day = days.FirstOrDefault(d => d.Date == v.Date);
            if (day == null)
            {
                days.Add(new CalendarDay { Date = v.Date, DayType = CalendarDayType.Vacation });
            }
            else
            {
                day.DayType = CalendarDayType.Vacation;
            }
        }

        return days.Select(i => new DayInfo { Date = i.Date, DayType = i.DayType });
    }
}
