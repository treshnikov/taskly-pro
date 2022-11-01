using System.Globalization;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Users;

public class SharepointProjectPlansMerger
{
	private const bool IgnoreHolidays = true;

	public SharepointProjectPlansMerger(ITasklyDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	public async Task MergeProjectPlans(string fileName, CancellationToken cancellationToken)
	{
		// get tasks
		var path = Directory.GetParent(typeof(ImportDataFromIntranetRequestHandler).Assembly.Location)!.FullName;
		var projectTasksFileName = Path.Combine(path, fileName);
		var tasksFromSharepoint = ParseTasks(projectTasksFileName);

		using var transaction = _dbContext.Database.BeginTransaction();

		await AddNewProjectsAndTasks(tasksFromSharepoint, cancellationToken);
		await ClearProjectTaskEstimationsAsync(cancellationToken);
		await ImportProjectTaskEstimationsAsync(tasksFromSharepoint, cancellationToken);

		transaction.Commit();
	}

	private async Task ClearProjectTaskEstimationsAsync(CancellationToken cancellationToken)
	{
		foreach (var pte in _dbContext.ProjectTaskEstimations)
		{
			_dbContext.ProjectTaskEstimations.Remove(pte);
		}

		await _dbContext.SaveChangesAsync(cancellationToken);
	}

	private async Task ImportProjectTaskEstimationsAsync(SharepointProjectTaskInfoXlsx[] tasksFromSharepoint, CancellationToken cancellationToken)
	{
		var dbProjects = await _dbContext.Projects
			.Include(p => p.Tasks)
				.ThenInclude(i => i.ProjectTaskEstimations)
				.ThenInclude(i => i.Estimations)
				.ThenInclude(i => i.UserPosition)
			.ToListAsync(cancellationToken);
		var dbPositions = await _dbContext.UserePositions.ToListAsync(cancellationToken);
		var dbDeps = await _dbContext.Departments.ToListAsync(cancellationToken);

		foreach (var sharepointTask in tasksFromSharepoint)
		{
			var dbProject = sharepointTask.ProjectId.HasValue
				? dbProjects.First(i => i.Id == sharepointTask.ProjectId.Value)
				: dbProjects.First(i => i.ShortName == sharepointTask.ProjectName);

			var dbTask = dbProject.Tasks.FirstOrDefault(
					t => t.ProjectId == dbProject.Id &&
					t.Description == sharepointTask.Description &&
					t.Comment == sharepointTask.Comment);

			// estimations by departments
			var idx = 0;
			var positionIdx = 1;
			var depCode = 0;
			Department? dbDep = null;
			while (idx < _departmentUserMap.Length)
			{
				if (int.TryParse(_departmentUserMap[idx], out depCode))
				{
					dbDep = dbDeps.First(i => i.Code == depCode);
					//Console.WriteLine($">> " + dbDep.Name);
					idx++;
					continue;
				}

				var positionName = _departmentUserMap[idx];
				var dbPosition = dbPositions.FirstOrDefault(p => p.Name == positionName);
				if (dbPosition == null)
				{
					//Log.Logger.Error($"{positionIdx}       >> Cannot find user position with the name = {DepartmentUserMap[idx]}");
				}
				else
				{
					//($"{positionIdx}       >> " + dbPosition.Name);
					var projTaskEst = dbTask.ProjectTaskEstimations.FirstOrDefault(i => i.Department.Id == dbDep!.Id);
					if (projTaskEst == null)
					{
						projTaskEst = new ProjectTaskEstimation
						{
							Id = Guid.NewGuid(),
							Estimations = new List<ProjectTaskUserPositionEstimation>(),
							ProjectTask = dbTask,
							ProjectTaskId = dbTask.Id,
							Department = dbDep!
						};
						dbTask.ProjectTaskEstimations.Add(projTaskEst);
						//_dbContext.ProjectTaskEstimations.Add(projTaskEst);
						//_dbContext.ProjectTasks.Update(dbTask);
					}

					var estAsStr = sharepointTask.Estimations[positionIdx - 1].Replace(",", ".").Split('.')[0];
					var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
					if (float.TryParse(estAsStr, NumberStyles.Any, ci, out float hours) && hours > 0)
					{
						var userEst = new ProjectTaskUserPositionEstimation
						{
							Id = Guid.NewGuid(),
							Hours = (int)hours,
							ProjectTaskDepartmentEstimation = projTaskEst,
							ProjectTaskDepartmentEstimationId = projTaskEst.Id,
							UserPosition = dbPosition
						};

						projTaskEst.Estimations.Add(userEst);
					}

				}
				positionIdx++;
				idx++;
			}

			// remove records with zero estimation
			dbTask.ProjectTaskEstimations = dbTask.ProjectTaskEstimations.Where(e => e.Estimations.Count > 0).ToList();
			_dbContext.ProjectTaskEstimations.RemoveRange(dbTask.ProjectTaskEstimations.Where(e => e.Estimations.Count <= 0));
		}
		await _dbContext.SaveChangesAsync(cancellationToken);
	}

	private async Task AddNewProjectsAndTasks(SharepointProjectTaskInfoXlsx[] tasksFromSharepoint, CancellationToken cancellationToken)
	{
		var dbProjects = await _dbContext.Projects
			.Include(p => p.Tasks)
				.ThenInclude(i => i.ProjectTaskEstimations)
				.ThenInclude(i => i.Estimations)
				.ThenInclude(i => i.UserPosition)
			.ToListAsync(cancellationToken);

		foreach (var sharepointTask in tasksFromSharepoint)
		{
			Project? dbProject = null;

			// Project with custom name such as Отпуск, АДМ, etc.
			if (!sharepointTask.ProjectId.HasValue)
			{
				dbProject = dbProjects.FirstOrDefault(i => i.ShortName == sharepointTask.ProjectName);
				if (dbProject == null)
				{
					dbProject = new Project
					{
						Id = Random.Shared.Next(10_000, 100_000),
						Name = sharepointTask.ProjectName!,
						ShortName = sharepointTask.ProjectName,
						IsOpened = true,
						Type = ProjectType.Internal,
						Start = new DateTime(2000, 01, 01),
						End = new DateTime(2050, 01, 01),
						Contract = sharepointTask.ProjectName,
						Tasks = new List<ProjectTask>()
					};

					_dbContext.Projects.Add(dbProject);
					dbProjects.Add(dbProject);
					Log.Logger.Warning($"New project was added {sharepointTask.ProjectId} {sharepointTask.ProjectName}");
					await _dbContext.SaveChangesAsync(cancellationToken);
				}
			}
			// projects with Id
			else
			{
				dbProject = dbProjects.FirstOrDefault(i => i.Id == sharepointTask.ProjectId);
			}

			if (dbProject == null)
			{
				Log.Logger.Error($"Cannot import tasks for projectId={sharepointTask.ProjectId} {sharepointTask.ProjectName}");
				continue;
			}

			dbProject.Type = sharepointTask.ProjectType == ProjectType.External && !dbProject.ShortName!.Contains("Внутр.")
				? ProjectType.External
				: ProjectType.Internal;

			var dbTask = dbProject.Tasks.FirstOrDefault(
					t => t.ProjectId == dbProject.Id &&
					t.Description == sharepointTask.Description &&
					t.Comment == sharepointTask.Comment);

			if (dbTask == null)
			{
				dbTask = new ProjectTask
				{
					Id = Guid.NewGuid(),
					ProjectId = dbProject.Id,
					Description = sharepointTask.Description,
					Comment = sharepointTask.Comment,
					Start = sharepointTask.Start,
					End = sharepointTask.End,
					ProjectTaskEstimations = new List<ProjectTaskEstimation>(),
					Project = dbProject
				};
				dbProject.Tasks.Add(dbTask);
				Log.Logger.Information($"New task added {dbProject.ShortName} : {dbTask.Description}");
			}
			else
			{
				dbTask.Start = sharepointTask.Start;
				dbTask.End = sharepointTask.End;
			}
		}
		await _dbContext.SaveChangesAsync(cancellationToken);
	}

	private static SharepointProjectTaskInfoXlsx[] ParseTasks(string projectTasksFileName)
	{
		var res = new List<SharepointProjectTaskInfoXlsx>();
		using var workbook = new XLWorkbook(projectTasksFileName);
		var worksheet = workbook.Worksheets.First(i => i.Name == "Задачи");
		var rowCount = Math.Min(worksheet.RowCount(), 5000);

		// skip first 4 lines with headers
		for (int rowIdx = 4; rowIdx <= rowCount; rowIdx++)
		{
			//Log.Logger.Debug($"#{rowIdx}");

			// project can contain . symbol - for instance, "985.1" 
			// we need to take only the first part
			int? projectId = null;
			string? projectName = string.Empty;
			var projectIdAsStr = worksheet.Cell(rowIdx, 3).GetValue<string>();

			if (string.IsNullOrWhiteSpace(projectIdAsStr))
			{
				Log.Logger.Information($"Parsing of file {projectTasksFileName} stoped at row = {rowIdx} because the cell with id of the project is empty.");
				break;
			}

			if (IgnoreHolidays && string.Equals("отпуск", projectIdAsStr.ToLower().Trim()))
			{
				continue;
			}

			projectIdAsStr = projectIdAsStr.Split(".")[0];
			if (int.TryParse(projectIdAsStr, out int projectIdParsed))
			{
				//Console.WriteLine($"Skip {projectIdAsStr}");
				// continue;
				projectId = projectIdParsed;
			}
			else
			{
				projectName = projectIdAsStr;
			}

			var task = worksheet.Cell(rowIdx, 9).GetValue<string>();
			if (task == "Отпуск")
			{
				task = worksheet.Cell(rowIdx, 8).GetValue<string>();
			}

			if (string.IsNullOrWhiteSpace(task))
			{
				task = "---";
			}
			var projectTypeAsStr = worksheet.Cell(rowIdx, 2).GetValue<string>();
			var projectType = GetProjectType(projectTypeAsStr);

			var startStr = worksheet.Cell(rowIdx, 12).GetValue<string>();
			var start = string.IsNullOrWhiteSpace(startStr)
				? DateTime.Today.AddDays(-1)
				: DateTime.Parse(startStr);
			var endStr = worksheet.Cell(rowIdx, 13).GetValue<string>();

			// fix common fill in mistakes
			if (endStr.Contains("31.11"))
			{
				Log.Logger.Warning($"An incorrect format of date {endStr} found at {projectTasksFileName} projectId: {projectIdAsStr} rowIdx: {rowIdx}");
				endStr = endStr.Replace("31.11", "31.12");
			}

			var end = string.IsNullOrWhiteSpace(endStr)
				? DateTime.Today
				: DateTime.Parse(endStr);
			var comment = worksheet.Cell(rowIdx, 5).GetValue<string>() + " " + worksheet.Cell(rowIdx, 6).GetValue<string>();

			var est = new List<string>();
			// estimations
			var startColumn = 16;
			for (int i = 0; i < 91; i++)
			{
				est.Add(worksheet.Cell(rowIdx, startColumn + i).GetValue<string>());
			}

			res.Add(new SharepointProjectTaskInfoXlsx
			{
				ProjectId = projectId,
				ProjectName = projectName,
				Description = task,
				Comment = comment,
				Start = start,
				End = end,
				ProjectType = projectType,
				Estimations = est.ToArray()
			});
		}

		return res.ToArray();
	}

	private static ProjectType GetProjectType(string projectTypeAsStr)
	{
		return projectTypeAsStr is "Внутр." or
								"Отпуск" or
								"ВИ" or
								"Серт." or
								"Внутр.1" or
								"Обучение" or
								"Прочее" or
								"Промышленная Сеть" or
								"Пов.квалиф."
								? ProjectType.Internal
								: ProjectType.External;
	}

	/// <summary>
	/// Map for parsing project_tasks.xlsx
	/// </summary>
	/// <value></value>
	private readonly string[] _departmentUserMap = new string[]{
		"141",
			"Технический директор",
		"244",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Начальник отдела",
		"245",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Начальник отдела",
		"234",
			"Главный специалист", "Ведущий инженер-программист", "Инженер-программист 1 категории", "Инженер-программист 2 категории", "Инженер-программист 3 категории", "Техник", "Начальник отдела",
		"176",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Начальник отдела",
		"232",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Начальник отдела",
		"233",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Начальник отдела",
		"242",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Начальник отдела",
		"243",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Начальник отдела",
		"177",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Начальник ЭТЛ",
		"198",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник",
		"199",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник",
		"178",
			"Начальник отдела",
		"179",
			"Электрогазосварщик 6 разряда", "Электрогазосварщик 5 разряда", "Электрогазосварщик 4 разряда", "Электромонтажник 5 разряда", "Электромонтажник 4 разряда", "Электромонтажник 3 разряда", "Начальник электромонтажного участка",
		"239",
			"Главный специалист", "Ведущий инженер", "Инженер 1 категории", "Инженер 2 категории", "Инженер 3 категории", "Техник", "Заместитель главного инженера по проектам-начальник отдела"
				};
	private readonly ITasklyDbContext _dbContext;
}