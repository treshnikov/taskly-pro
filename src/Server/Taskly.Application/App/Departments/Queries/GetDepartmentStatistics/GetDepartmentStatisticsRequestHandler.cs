using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Calendar;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Departments.Queries.GetDepartmentStatistics;

public class GetDepartmentStatisticsRequestHandler : IRequestHandler<GetDepartmentStatisticsRequest, DepartmentStatisticsVm>
{
	private readonly ITasklyDbContext _dbContext;
	private readonly ICalendarService _calendarService;

	public GetDepartmentStatisticsRequestHandler(ITasklyDbContext dbContext, ICalendarService calendarService)
	{
		_dbContext = dbContext;
		_calendarService = calendarService;
	}
	public async Task<DepartmentStatisticsVm> Handle(GetDepartmentStatisticsRequest request, CancellationToken cancellationToken)
	{
		var res = new DepartmentStatisticsVm
		{
			Projects = new List<ProjectStatVm>(),
			Weeks = new List<ProjectToDepartmentEstimationVm>(),
			Summary = new DepartmentStatisticsSummaryVm()
		};

		// get department by id
		var dep = await _dbContext.Departments
			.Include(d => d.UserDepartments).ThenInclude(d => d.UserPosition)
			.Include(d => d.UserDepartments).ThenInclude(d => d.User)
			.AsNoTracking()
			.FirstAsync(i => i.Id == request.DepartmentId, cancellationToken);

		var tasks = await _dbContext.ProjectTasks
			.Include(i => i.Project)
			.Include(i => i.ProjectTaskEstimations).ThenInclude(i => i.Estimations).ThenInclude(i => i.UserPosition)
			.Include(i => i.ProjectTaskEstimations).ThenInclude(i => i.Department)
			.AsNoTracking()
			.Where(t =>
					request.Start <= t.End && t.Start <= request.End &&
					t.ProjectTaskEstimations.Any(de => de.Department.Id == request.DepartmentId && de.Estimations.Sum(des => des.Hours) > 0)
			)
			.OrderBy(i => i.Id)
			.ToListAsync(cancellationToken);

		var plans = await _dbContext.DepartmentPlans
			.AsNoTracking()
			.Include(i => i.ProjectTask)
			.Where(i =>
				i.DepartmentId == dep.Id &&
				i.WeekStart >= request.Start && i.WeekStart <= request.End)
			.ToListAsync(cancellationToken);

		await FillProjectInfo(request, res, dep, tasks, plans, cancellationToken);
		await FillProjectToDepartmentEstimationsAsync(request, res, dep, tasks, plans, cancellationToken);
		await FillSummary(request, res, cancellationToken);

		return await Task.FromResult(res);
	}

	private async Task FillSummary(GetDepartmentStatisticsRequest request, DepartmentStatisticsVm res, CancellationToken cancellationToken)
	{
		res.Summary.Start = request.Start;
		res.Summary.End = request.End;
		res.Summary.AvailableHoursForPlanning = await _calendarService.GetSumOfDepartmentWorkingHoursAsync(request.DepartmentId, request.Start, request.End, cancellationToken);
		res.Summary.HoursPlannedForDepartment = res.Projects.Select(i => i.PlannedTaskHoursForDepartment).Sum();
		res.Summary.HoursPlannedByHeadOfDepartment = res.Projects.Select(i => i.PlannedTaskHoursByDepartment).Sum();
		res.Summary.WorkLoadPercentage = Math.Round(100 * res.Summary.HoursPlannedForDepartment / res.Summary.AvailableHoursForPlanning, 2);
		res.Summary.SumOfVacationHours = await _calendarService.GetSumOfDepartmentHolidaysHoursAsync(request.DepartmentId, request.Start, request.End, cancellationToken);

		var externalProjectsHours = res.Projects.Where(p => p.ProjectType == ProjectType.External).Select(i => i.PlannedTaskHoursForDepartment).Sum();
		var internalProjectsHours = res.Projects.Where(p => p.ProjectType == ProjectType.Internal).Select(i => i.PlannedTaskHoursForDepartment).Sum();
		res.Summary.ExternalProjectsRateInPercentage = Math.Round(100 * externalProjectsHours / (internalProjectsHours + externalProjectsHours), 2);

		// check NaN
		if (
			double.IsNaN(res.Summary.WorkLoadPercentage) || double.IsInfinity(res.Summary.WorkLoadPercentage) ||
			double.IsNaN(res.Summary.ExternalProjectsRateInPercentage) || double.IsInfinity(res.Summary.ExternalProjectsRateInPercentage))
		{
			res.Summary.ExternalProjectsRateInPercentage = 0;
			res.Summary.WorkLoadPercentage = 0;
		}
	}

	private async Task FillProjectToDepartmentEstimationsAsync(GetDepartmentStatisticsRequest request, DepartmentStatisticsVm res, Department dep, List<ProjectTask> tasks, List<DepartmentPlan> plans, CancellationToken cancellationToken)
	{
		var dbProjects = await _dbContext.Projects.AsNoTracking().ToListAsync(cancellationToken);
		var departmentAvailableHours =
			(await _calendarService.GetDepartmentWorkingHoursAsync(request.DepartmentId, request.Start, request.End, cancellationToken))
			.ToDictionary(i => i.Monday, i => i.HoursAvailableForPlanning);


		// find first monday
		var weekStart = request.Start;
		while (weekStart.DayOfWeek != DayOfWeek.Monday)
		{
			weekStart = weekStart.AddDays(1);
		}

		// iterate through weeks and calculate the sum of planned hours
		var weekIdx = 0;
		while (weekStart <= request.End)
		{
			var estimationVm = new ProjectToDepartmentEstimationVm
			{
				WeekStart = weekStart,
				DepartmentPlannedHours = 0,
				ProjectPlannedHours = 0,
				DepartmentAvailableHours = departmentAvailableHours[weekStart],
				ProjectPlanDetails = new List<ProjectPlanDetailVm>(),
				DepartmentPlanDetails = new List<ProjectPlanDetailVm>()
			};

			// plan by departments
			estimationVm.DepartmentPlannedHours = plans.Where(i => i.WeekStart == weekStart).Sum(i => i.Hours);
			foreach (var planGroup in plans.Where(i => i.WeekStart == weekStart).GroupBy(p => p.ProjectTask.ProjectId))
			{
				var projId = planGroup.Key;
				var proj = dbProjects.First(t => t.Id == projId);

				estimationVm.DepartmentPlanDetails.Add(new ProjectPlanDetailVm
				{
					ProjectName = $"{projId}: {proj.ShortName ?? proj.Name}",
					Hours = planGroup.Sum(i => i.Hours)
				});
			}

			// plan in project tasks
			var tasksGroupedByProjects = tasks.OrderBy(i => i.ProjectId).GroupBy(i => i.ProjectId);
			foreach (var taskGroup in tasksGroupedByProjects)
			{
				var projId = taskGroup.Key;
				double projHours = 0;
				foreach (var task in taskGroup)
				{
					foreach (var de in task.ProjectTaskEstimations.Where(d => d.Department.Id == dep.Id))
					{
						foreach (var e in de.Estimations)
						{
							var hours = CalculateAvailableTime(task.Start, task.End, weekStart, weekStart.AddDays(7).AddSeconds(-1), e.Hours);
							projHours += hours;
							estimationVm.ProjectPlannedHours += hours;
						}
					}
				}

				if (projHours > 0)
				{
					var proj = dbProjects.First(t => t.Id == projId);
					estimationVm.ProjectPlanDetails.Add(
						new ProjectPlanDetailVm
						{
							Hours = ((long)projHours == 0 ? Math.Round(projHours, 1) : (long)projHours),
							ProjectName = $"{projId}: {proj.ShortName ?? proj.Name}"
						});
				}
			}

			estimationVm.DepartmentPlanDetails = estimationVm.DepartmentPlanDetails.OrderBy(i => i.ProjectName).ToList();
			estimationVm.ProjectPlanDetails = estimationVm.ProjectPlanDetails.OrderBy(i => i.ProjectName).ToList();
			estimationVm.ProjectPlannedHours = (long)estimationVm.ProjectPlannedHours;
			res.Weeks.Add(estimationVm);
			weekStart = weekStart.AddDays(7);

			weekIdx++;
		}
	}

	private async Task FillProjectInfo(GetDepartmentStatisticsRequest request, DepartmentStatisticsVm res, Department dep, List<ProjectTask> tasks, List<DepartmentPlan> plans, CancellationToken cancellationToken)
	{
		// handle all projects and tasks planned for given timerange for the department
		HandleHoursInProjects(request, tasks, res, dep);

		// handle estimations for departments
		// corner case when an estimation was set by the head of the department but the project doesn't contain a task for this estimation
		await HandleHoursPlannedByDepartment(plans, res, cancellationToken);

		// now we can calculate delta between project plan and department plan
		HandleDelta(res);
	}

	private static void HandleDelta(DepartmentStatisticsVm res)
	{
		foreach (var p in res.Projects)
		{
			p.DeltaHours = p.PlannedTaskHoursForDepartment - p.PlannedTaskHoursByDepartment;
		}
	}

	private async Task HandleHoursPlannedByDepartment(List<DepartmentPlan> departmentEstimations, DepartmentStatisticsVm res, CancellationToken cancellationToken)
	{
		var departmentEstimationsLookup = departmentEstimations.ToLookup(i => i.ProjectTask.ProjectId, j => j.Hours);

		foreach (var projHours in departmentEstimationsLookup)
		{
			var projId = projHours.Key;
			double totalHours = 0;
			foreach (var hour in projHours)
			{
				totalHours += hour;
			}

			var resProj = res.Projects.FirstOrDefault(i => i.Id == projId);
			if (resProj == null)
			{
				var proj = await _dbContext.Projects.AsNoTracking().FirstAsync(i => i.Id == projId, cancellationToken);
				resProj = new ProjectStatVm { Id = projId, ProjectType = proj.Type, Name = proj.ShortName ?? proj.Name, PlannedTaskHoursByDepartment = totalHours, PlannedTaskHoursForDepartment = 0 };
				res.Projects.Add(resProj);
			}

			resProj.PlannedTaskHoursByDepartment = (long)totalHours;
		}
	}

	private static void HandleHoursInProjects(GetDepartmentStatisticsRequest request, List<ProjectTask> tasks, DepartmentStatisticsVm res, Department dep)
	{
		var tasksGroupedByProject = tasks.GroupBy(t => t.Project.Id);
		foreach (var taskGroup in tasksGroupedByProject)
		{
			var proj = tasks.First(i => i.ProjectId == taskGroup.Key).Project;
			var projStat = new ProjectStatVm
			{
				Id = proj.Id,
				Name = proj.ShortName ?? proj.Name,
				ProjectType = proj.Type,
				PlannedTaskHoursByDepartment = 0,
				PlannedTaskHoursForDepartment = 0,
				DeltaHours = 0
			};

			foreach (var task in taskGroup)
			{
				foreach (var de in task.ProjectTaskEstimations.Where(d => d.Department.Id == dep.Id))
				{
					foreach (var e in de.Estimations)
					{
						var hours = CalculateAvailableTime(task.Start, task.End, request.Start, request.End, e.Hours);
						projStat.PlannedTaskHoursForDepartment += hours;
						//Log.Logger.Warning($"{task.ProjectId}: {task.Project.ShortName} - {e.UserPosition.Ident} / add {hours} from {e.Hours} that were planned for period from {task.Start.ToString("dd.MM.yyyy")} to {task.End.ToString("dd.MM.yyyy")}");
					}
				}
			}

			projStat.PlannedTaskHoursForDepartment = (long)projStat.PlannedTaskHoursForDepartment;
			res.Projects.Add(projStat);
		}
	}

	private static double CalculateAvailableTime(DateTime tStart, DateTime tEnd, DateTime rStart, DateTime rEnd, int hours)
	{
		/*
                # case 1 - available time equals task to request time 
                task                        ts|-------------------|te
                request                             rs|-----|re
            */
		if (tStart <= rStart && tEnd >= rEnd)
		{
			return hours * ((rEnd - rStart).TotalHours / (tEnd - tStart).TotalHours);
		}

		/*
                # case 2 - available time equals to task time
                task                       			     ts|-------|te
                request                             rs|-----------------|re
            */
		if (tStart >= rStart && tEnd <= rEnd)
		{
			return hours;
		}

		/*
                # case 3 - available time equals a time segment from request start to task end
                task                       	   ts|-------|te
                request                             rs|-----------------|re
            */
		if (rStart >= tStart && rStart <= tEnd)
		{
			return hours * ((tEnd - rStart).TotalHours / (tEnd - tStart).TotalHours);
		}

		/*
                # case 4 - available time equals a time segment from task start to request end
                task                       	   					  ts|-------|te
                request                             rs|-----------------|re

            */
		if (tStart >= rStart && tStart <= rEnd)
		{
			return hours * ((rEnd - tStart).TotalHours / (tEnd - tStart).TotalHours);
		}

		return 0;
	}
}