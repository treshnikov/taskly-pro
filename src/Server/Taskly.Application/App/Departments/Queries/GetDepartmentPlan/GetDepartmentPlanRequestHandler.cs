using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.App.Users.Specs;
using Taskly.Application.Calendar;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Departments.Queries.GetDepartmentPlan;

public class GetDepartmentPlanRequestHandler : IRequestHandler<GetDepartmentPlanRequest, DepartmentPlanRecordVm[]>
{
	private readonly ITasklyDbContext _dbContext;
	private readonly ICalendarService _calendarService;
	public GetDepartmentPlanRequestHandler(ITasklyDbContext dbContext, ICalendarService calendarService)
	{
		_dbContext = dbContext;
		_calendarService = calendarService;
	}
	public async Task<DepartmentPlanRecordVm[]> Handle(GetDepartmentPlanRequest request, CancellationToken cancellationToken)
	{
		try
		{
			var res = new List<DepartmentPlanRecordVm>();

			// get department by id
			var dep = await _dbContext.Departments
				.Include(d => d.UserDepartments).ThenInclude(d => d.UserPosition)
				.Include(d => d.UserDepartments).ThenInclude(d => d.User)
				.AsNoTracking()
				.FirstAsync(i => i.Id == request.DepartmentId, cancellationToken);

			// get users of the department
			var users = dep.UserDepartments;

			// get project tasks that have any estimation for the given department
			var tasks = await _dbContext.ProjectTasks
				.Include(i => i.Project)
				.Include(i => i.ProjectTaskEstimations).ThenInclude(i => i.Department)
				.Include(i => i.ProjectTaskEstimations).ThenInclude(i => i.Estimations)
				//.Include(i => i.DepartmentEstimations).ThenInclude(i => i.ProjectTask).ThenInclude(i => i.Project)
				.AsNoTracking()
				.Where(
					t =>
						request.Start <= t.End && t.Start <= request.End &&
						t.ProjectTaskEstimations.Any(de => de.Department.Id == request.DepartmentId && de.Estimations.Sum(des => des.Hours) > 0)
				)
				.ToListAsync(cancellationToken);

			// laod plans for each employee for each week for each project task
			var plans = await _dbContext.DepartmentPlans
				.Include(i => i.ProjectTask).ThenInclude(i => i.Project)
				.Include(i => i.User)
				.AsNoTracking()
				.Where(t =>
					t.DepartmentId == request.DepartmentId &&
					t.WeekStart >= request.Start && t.WeekStart <= request.End)
				.ToListAsync(cancellationToken);
			var plansDict = plans.ToDictionary(i => (i.UserId, i.ProjectTaskId, i.WeekStart), i => i.Hours);

			var plannedTasks = plans.Select(i => i.ProjectTask);

			// add project tasks that have already been planned before for the given department
			tasks.AddRange(plannedTasks);
			tasks = tasks.DistinctBy(i => i.Id).OrderBy(i => i.ProjectId).ToList();

			// compose view model
			foreach (var user in users)
			{
				// build a list of weeks according to start and end dates            
				var weeks = _calendarService.GetUserWorkingHours(user, request.Start, request.End);

				var vm = new DepartmentPlanRecordVm
				{
					UserId = user.User.Id,
					UserName = user.User.Name,
					QuitDate = user.User.QuitDate,
					HiringDate = user.User.HiringDate,
					UserPosition = string.IsNullOrWhiteSpace(user.UserPosition.Ident) ? user.UserPosition.Name : user.UserPosition.Ident,
					Rate = user.User.UserDepartments.Count > 0 ? user.User.UserDepartments.Max(i => i.Rate) : 0,
					Tasks = new List<TaskPlanVm>(),
					Weeks = weeks
				};

				foreach (var task in tasks)
				{
					var taskPlan = new TaskPlanVm
					{
						ProjectTaskId = task.Id,
						ProjectName = task.Project.Name,
						ProjectShortName = task.Project.ShortName ?? string.Empty,
						TaskStart = task.Start,
						TaskEnd = task.End,
						Plans = new List<UserProjectWeekPlanVm>(),
						TaskName = task.Description,
						ProjectId = task.ProjectId
					};

					var weekIdx = 1;
					foreach (var week in weeks)
					{
						var weekPlan = new UserProjectWeekPlanVm
						{
							WeekNumber = weekIdx,
							WeekStart = week.Monday,
							IsWeekAvailableForPlanning =
								task.Start <= week.Monday && task.End >= week.Monday ||
								task.Start <= week.Monday.AddDays(1) && task.End >= week.Monday.AddDays(1) ||
								task.Start <= week.Monday.AddDays(2) && task.End >= week.Monday.AddDays(2) ||
								task.Start <= week.Monday.AddDays(3) && task.End >= week.Monday.AddDays(3) ||
								task.Start <= week.Monday.AddDays(4) && task.End >= week.Monday.AddDays(4)
						};

						// get hours planned for the given user, project task and week
						plansDict.TryGetValue((user.UserId, task.Id, week.Monday), out double hours);
						weekPlan.PlannedHours = hours;

						taskPlan.Plans.Add(weekPlan);

						weekIdx++;
					}

					//projectPlan.Plans = projectPlan.Plans.Where(p => p.PlannedHours > 0).ToList();
					vm.Tasks.Add(taskPlan);
				}

				res.Add(vm);
			}

			// show work plan only for users who works or who had quit but has some planned time
			res = res.Where(
					u =>
					UserSpecs.WorksInTheCompany.IsSatisfiedBy(users.First(j => j.UserId == u.UserId).User) ||
					u.Tasks.Any(p => p.Plans.Sum(i => i.PlannedHours) > 0)).ToList();

			return res.OrderBy(i => i.UserPosition).ToArray();
		}
		catch (Exception)
		{
			throw;
		}

	}
}