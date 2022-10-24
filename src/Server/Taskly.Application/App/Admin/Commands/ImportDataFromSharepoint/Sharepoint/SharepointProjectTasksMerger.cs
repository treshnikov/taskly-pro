using System.Globalization;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Users
{
    public class SharepointProjectTasksMerger
    {
        private const bool _ignoreHolidays = true;

        public SharepointProjectTasksMerger(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task UpdateProjectTasks(string fileName, CancellationToken cancellationToken)
        {
            var path = Directory.GetParent(typeof(ImportDataFromIntranetRequestHandler).Assembly.Location)!.FullName;
            var projectTasksFileName = Path.Combine(path, fileName);

            var tasks = ParseTasks(projectTasksFileName);
            var rand = new Random();

            using var transaction = _dbContext.Database.BeginTransaction();

            var dbProjects = _dbContext.Projects
                .Include(p => p.Tasks)
                .ToList();
            var dbPositions = await _dbContext.UserePositions.ToListAsync(cancellationToken);
            var dbDeps = await _dbContext.Departments.ToListAsync(cancellationToken);

            foreach (var p in dbProjects)
            {
                p.Tasks.Clear();
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            foreach (var t in tasks)
            {
                Project? dbProject = null;
                if (!t.ProjectId.HasValue)
                {
                    dbProject = dbProjects.FirstOrDefault(i => i.Name == t.ProjectName);
                    if (dbProject == null)
                    {
                        dbProject = new Project
                        {
                            Id = rand.Next(10_000, 100_000),
                            Name = t.ProjectName!,
                            ShortName = t.ProjectName,
                            IsOpened = true,
                            Type = ProjectType.Internal,
                            Start = new DateTime(2000, 01, 01),
                            End = new DateTime(2050, 01, 01),
                            Contract = t.ProjectName,
                            Tasks = new List<ProjectTask>()
                        };
                        _dbContext.Projects.Add(dbProject);
                        dbProjects.Add(dbProject);
                        await _dbContext.SaveChangesAsync(cancellationToken);
                    }
                }
                else
                {
                    dbProject = dbProjects.FirstOrDefault(i => i.Id == t.ProjectId);
                }

                if (dbProject == null)
                {
                    Log.Logger.Warning($"Cannot import tasks for projectId={t.ProjectId} {t.ProjectName}");
                    continue;
                }

                dbProject.Type = t.ProjectType == ProjectType.External && !dbProject.ShortName!.Contains("Внутр.")
                    ? ProjectType.External
                    : ProjectType.Internal;

                // task
                var newTask = new ProjectTask
                {
                    Id = Guid.NewGuid(),
                    ProjectId = dbProject.Id,
                    Description = t.Description,
                    Comment = t.Comment,
                    Start = t.Start,
                    End = t.End,
                    DepartmentEstimations = new List<ProjectTaskDepartmentEstimation>(),
                };

                // estimations by departments
                var idx = 0;
                var positionIdx = 1;
                var depCode = 0;
                Domain.Department dbDep = null;
                while (idx < DepartmentUserMap.Length)
                {
                    if (int.TryParse(DepartmentUserMap[idx], out depCode))
                    {
                        dbDep = dbDeps.First(i => i.Code == depCode);
                        //Console.WriteLine($">> " + dbDep.Name);
                        idx++;
                        continue;
                    }

                    var positionName = DepartmentUserMap[idx];
                    var dbPosition = dbPositions.FirstOrDefault(p => p.Name == positionName);
                    if (dbPosition == null)
                    {
                        //Console.WriteLine($"{positionIdx}       >> Cannot find user position with the name = {DepartmentUserMap[idx]}");
                    }
                    else
                    {
                        //($"{positionIdx}       >> " + dbPosition.Name);
                        var depEst = newTask.DepartmentEstimations.FirstOrDefault(i => i.Department.Id == dbDep.Id);
                        if (depEst == null)
                        {
                            depEst = new ProjectTaskDepartmentEstimation
                            {
                                Id = Guid.NewGuid(),
                                Estimations = new List<ProjectTaskDepartmentEstimationToUserPosition>(),
                                ProjectTask = newTask,
                                ProjectTaskId = newTask.Id,
                                Department = dbDep
                            };
                            newTask.DepartmentEstimations.Add(depEst);
                        }

                        var estAsStr = t.Estimations[positionIdx - 1].Replace(",", ".").Split('.')[0];
                        var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
                        if (float.TryParse(estAsStr, NumberStyles.Any, ci, out float hours))
                        {
                            if (hours > 0)
                            {
                                depEst.Estimations.Add(new ProjectTaskDepartmentEstimationToUserPosition
                                {
                                    Id = Guid.NewGuid(),
                                    //todo float
                                    Hours = (int)hours,
                                    ProjectTaskDepartmentEstimation = depEst,
                                    ProjectTaskDepartmentEstimationId = depEst.Id,
                                    UserPosition = dbPosition
                                });
                            }
                        }

                    }
                    positionIdx++;
                    idx++;
                }

                // remove records with zero estimation
                newTask.DepartmentEstimations = newTask.DepartmentEstimations.Where(e => e.Estimations.Count > 0).ToList();
                _dbContext.ProjectTasks.Add(newTask);

                dbProject.Tasks.Add(newTask);
                _dbContext.Projects.Update(dbProject);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
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
                if (_ignoreHolidays && string.Equals("отпуск", projectIdAsStr.ToLower().Trim()))
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
                    break;
                }
                var projectTypeAsStr = worksheet.Cell(rowIdx, 2).GetValue<string>();
                var projectType = GetProjectType(projectTypeAsStr);

                var startStr = worksheet.Cell(rowIdx, 12).GetValue<string>();
                var start = string.IsNullOrWhiteSpace(startStr)
                    ? DateTime.Today.AddDays(-1)
                    : DateTime.Parse(startStr);
                var endStr = worksheet.Cell(rowIdx, 13).GetValue<string>();
                
                // fix common fill in mistakes
                endStr = endStr.Replace("31.11", "31.12");
                
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
            return projectTypeAsStr == "Внутр." ||
                                    projectTypeAsStr == "Отпуск" ||
                                    projectTypeAsStr == "ВИ" ||
                                    projectTypeAsStr == "Серт." ||
                                    projectTypeAsStr == "Внутр.1" ||
                                    projectTypeAsStr == "Обучение" ||
                                    projectTypeAsStr == "Прочее" ||
                                    projectTypeAsStr == "Промышленная Сеть" ||
                                    projectTypeAsStr == "Пов.квалиф."
                                    ? ProjectType.Internal
                                    : ProjectType.External;
        }

        /// <summary>
        /// Map for parsing project_tasks.xlsx
        /// </summary>
        /// <value></value>
        private string[] DepartmentUserMap = new string[]{
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
}