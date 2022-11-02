using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.App.Users.Specs;
using Taskly.Application.Calendar;
using Taskly.Application.Interfaces;

namespace Taskly.Application.App.Reports;

public class GetWeekPlanReportRequestHandler : IRequestHandler<GetWeekPlanReportRequest, WeekPlanReportVm>
{
	private readonly ITasklyDbContext _dbContext;
	private readonly ICalendarService _calendar;

	public GetWeekPlanReportRequestHandler(ITasklyDbContext dbContext, ICalendarService calendar)
	{
		_dbContext = dbContext;
		_calendar = calendar;
	}
	public async Task<WeekPlanReportVm> Handle(GetWeekPlanReportRequest request, CancellationToken cancellationToken)
	{
		var res = new WeekPlanReportVm
		{
			Departments = new List<WeekPlanDepartmentVm>()
		};

		var deps = await _dbContext.Departments
			.Where(d => d.IncludeInWorkPlan)
			.OrderBy(d => d.Name)
			.AsNoTracking()
			.ToListAsync(cancellationToken);

		foreach (var dep in deps)
		{
			var depUsers = await _dbContext.Users
				.Include(i => i.UserDepartments)
				.Where(UserSpecs.WorkedAtWeek(request.Monday))
				.Where(u => u.UserDepartments.Any(ud => ud.DepartmentId == dep.Id && ud.Rate > 0.1))
				.OrderBy(i => i.Name)
				.AsNoTracking()
				.ToListAsync(cancellationToken);
			var userIds = depUsers.Select(i => i.Id).ToList();

			var userPlans = await _dbContext.DepartmentPlans
				.Include(i => i.ProjectTask)
					.ThenInclude(i => i.Project)
				.Where(p => p.WeekStart == request.Monday && userIds.Contains(p.UserId))
				.OrderBy(p => p.ProjectTask.Project.Id).ThenByDescending(p => p.Hours)
				.AsNoTracking()
				.ToListAsync(cancellationToken);

			var depVm = new WeekPlanDepartmentVm
			{
				Name = dep.Name,
				Users = new List<WeekPlanUserVm>()
			};

			foreach (var user in depUsers)
			{
				var userRate = user.UserDepartments.Select(ud => ud.Rate).Max();
				var userVm = new WeekPlanUserVm
				{
					Name = user.Name,
					Rate = userRate,
					Plans = new List<WeekPlanVm>()
				};

				// add project plans
				foreach (var p in userPlans.Where(u => u.UserId == user.Id))
				{
					userVm.Plans.Add(new WeekPlanVm
					{
						ProjectId = p.ProjectTask.Project.Id,
						ProjectName = $" : {p.ProjectTask.Project.ShortName} - ",
						TaskName = p.ProjectTask.Description,
						Hours = p.Hours,
						TaskStart = p.ProjectTask.Start,
						TaskEnd = p.ProjectTask.End,
						TaskIsOutdated = !(request.Monday >= p.ProjectTask.Start && request.Monday <= p.ProjectTask.End)
					});
				}

				// add vacations
				var days = await _calendar.GetUserDaysInfoAsync(user.Name, request.Monday, request.Monday.AddDays(5).AddSeconds(-1), cancellationToken);
				var vacationDays = days.Where(d => d.DayType == Domain.CalendarDayType.Vacation);
				if (vacationDays.Any())
				{
					userVm.Plans.Add(new WeekPlanVm
					{
						Hours = vacationDays.Count() * 8 * userRate,
						TaskStart = vacationDays.Min(d => d.Date),
						TaskEnd = vacationDays.Max(d => d.Date),
						TaskIsOutdated = false,
						IsVacation = true
					});
				}

				depVm.Users.Add(userVm);
			}
			res.Departments.Add(depVm);
		}

		return await Task.FromResult(res);
	}
}