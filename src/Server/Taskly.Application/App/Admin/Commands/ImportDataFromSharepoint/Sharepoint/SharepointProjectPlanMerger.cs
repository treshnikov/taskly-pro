using System.Globalization;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Users
{
    public class SharepointProjectPlanMerger
    {
        private const bool IgnoreHolidays = true;

        private readonly ITasklyDbContext _dbContext;

        public SharepointProjectPlanMerger(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task UpdateProjectPlan(string fileName, int departmentCode, CancellationToken cancellationToken)
        {
            var path = Directory.GetParent(typeof(ImportDataFromIntranetRequestHandler).Assembly.Location)!.FullName;
            var filePath = Path.Combine(path, fileName);
            if (!File.Exists(filePath))
            {
                Console.WriteLine($"Cannot find {filePath}");
                return;
            }

            using var transaction = _dbContext.Database.BeginTransaction();
            var dbDep = _dbContext.Departments.First(i => i.Code == departmentCode);

            // remove old plans
            var plan = _dbContext.DepartmentPlans.Include(i => i.Department).Where(i => i.Department.Code == departmentCode);
            foreach (var item in plan)
            {
                _dbContext.DepartmentPlans.Remove(item);
            }
            await _dbContext.SaveChangesAsync(cancellationToken);

            //extract plans from Excel
            var plans = ExtractPlans(filePath);

            var dbUsers = await _dbContext.Users
                .Include(i => i.UserDepartments).ThenInclude(i => i.Department)
                .Include(i => i.UserDepartments).ThenInclude(i => i.UserPosition)
                .ToListAsync(cancellationToken);

            var dbProjects = await _dbContext.Projects
                .Include(p => p.Tasks)
                    .ThenInclude(i => i.DepartmentEstimations).ThenInclude(i => i.Department)
                .ToListAsync(cancellationToken);

            foreach (var planItem in plans)
            {
                var user = dbUsers.FirstOrDefault(i => i.Name == planItem.UserName);
                if (user == null)
                {
                    Log.Error($"Cannot find user by name {planItem.UserName}");
                    continue;
                }

                // overwrite user position to the curent department because
                // xlsx files has more relevant information about user-departmnet links
                var defaultPosition = user.UserDepartments.First();
                user.UserDepartments.Clear();
                user.UserDepartments.Add(new UserDepartment
                {
                    DepartmentId = dbDep.Id,
                    Department = dbDep,

                    // take a max possible rate because in Excel files some time the information can be newer than in the Intranet DB
                    Rate = Math.Max(planItem.Rate, defaultPosition.Rate),
                    User = user,
                    UserId = user.Id,
                    UserPosition = defaultPosition.UserPosition,
                    UserPositionId = defaultPosition.Id
                });

                foreach (var week in planItem.Weeks)
                {
                    foreach (var projectFromExcel in week.Projects)
                    {
                        Project? project = !projectFromExcel.ProjectCode.HasValue
                            ? dbProjects.FirstOrDefault(p => p.Name == projectFromExcel.ProjectName)
                            : dbProjects.FirstOrDefault(p => p.Id == projectFromExcel.ProjectCode.Value);

                        if (project == null)
                        {
                            project = new Project
                            {
                                Name = projectFromExcel.ProjectName,
                                ShortName = projectFromExcel.ProjectName,
                                Type = ProjectType.Internal,
                                Start = new DateTime(2000, 01, 01),
                                End = new DateTime(3000, 01, 01),
                                IsOpened = true,
                                Contract = "",
                                Tasks = new List<ProjectTask>()
                            };

                            dbProjects.Add(project);
                            _dbContext.Projects.Add(project);
                            await _dbContext.SaveChangesAsync(cancellationToken);
                        }

                        if (project.Tasks == null || project.Tasks.Count == 0)
                        {
                            project.Tasks = new List<ProjectTask>
                            {
                                new ProjectTask {
                                    Id = Guid.NewGuid(),
                                    Description = projectFromExcel.ProjectName,
                                    Start = new DateTime(DateTime.Today.Year, 01, 01),
                                    End = new DateTime(DateTime.Today.Year + 1, 01, 01),
                                    DepartmentEstimations = new List<ProjectTaskDepartmentEstimation>()
                                }
                            };
                        }

                        var tasksToAssign = project.Tasks
                            .Where(t =>
                                t.DepartmentEstimations.Any(de => de.Department.Id == dbDep.Id) &&
                                t.End >= week.WeekStart)
                            .OrderBy(t => t.Start)
                            .ToList();

                        var projectTask = tasksToAssign.Count == 0
                                ? project.Tasks.OrderByDescending(t => t.End).First()
                                : tasksToAssign.First();

                        var dp = new DepartmentPlan
                        {
                            Id = Guid.NewGuid(),
                            User = user,
                            ProjectTask = projectTask,
                            DepartmentId = dbDep.Id,
                            UserId = user.Id,
                            Hours = projectFromExcel.Hours,
                            WeekStart = week.WeekStart,
                            Department = dbDep,
                            ProjectTaskId = projectTask.Id,
                        };
                        _dbContext.DepartmentPlans.Add(dp);
                    }
                }
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private List<SharepointUserPlan> ExtractPlans(string filePath)
        {
            var res = new List<SharepointUserPlan>();

            using var workbook = new XLWorkbook(filePath);
            var worksheet = workbook.Worksheets.First(i => i.Name == "План");

            var userName = "";
            var userRateAsStr = "";
            double userRateAsFloat = (double)0;
            var rowIdx = 2;
            while (true)
            {
                userName = worksheet.Cell(rowIdx, 2).GetValue<string>().Trim();
                userRateAsStr = worksheet.Cell(rowIdx, 3).GetValue<string>().Trim().Replace(",", ".");

                // user name might contain additional comment after last name
                userName = string.Join(" ", userName.Split(' ').Take(3)).Trim();

                var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
                ci.NumberFormat.CurrencyDecimalSeparator = ".";

                if (!double.TryParse(userRateAsStr, NumberStyles.Any, ci, out userRateAsFloat))
                {
                    userRateAsFloat = (double)0;
                }

                if (string.IsNullOrWhiteSpace(userName))
                {
                    break;
                }

                var userPlan = new SharepointUserPlan
                {
                    UserName = userName,
                    Rate = userRateAsFloat,
                    Weeks = new List<SharepointWeekPlan>()
                };

                var weekIdx = 5;
                while (true)
                {
                    var weekStartStr = worksheet.Cell(1, weekIdx).GetValue<string>();
                    if (!DateTime.TryParse(weekStartStr, out DateTime weekStartAsDt))
                    {
                        Log.Logger.Error($"Cannot conver {weekStartStr} to DateTime");
                        break;
                    }

                    var planStr = worksheet.Cell(rowIdx, weekIdx).GetValue<string>();
                    if (string.IsNullOrWhiteSpace(planStr))
                    {
                        weekIdx++;
                        continue;
                    }

                    var weekPlan = new SharepointWeekPlan
                    {
                        WeekStart = weekStartAsDt,
                        Projects = new List<SharepointProjectPlan>()
                    };

                    foreach (var rec in planStr.Split("\n"))
                    {
                        if (string.IsNullOrWhiteSpace(rec) || !rec.Contains("="))
                        {
                            continue;
                        }

                        var projCodeAsStr = rec.Split("=")[0].Replace("#", string.Empty).Replace("№", string.Empty);

                        if (IgnoreHolidays && projCodeAsStr.ToLower().Contains("отпуск"))
                        {
                            continue;
                        }

                        // special cases when code of the project contains extra symbols after the dot char, for instance, 923.2  
                        if (projCodeAsStr.Contains('.'))
                        {
                            var first = projCodeAsStr.Split('.')[0];
                            if (int.TryParse(first, out int firstAsInt))
                            {
                                projCodeAsStr = first;
                            }
                        }

                        if (!int.TryParse(projCodeAsStr, out int projCode))
                        {
                            // handle АДМ, Партнеры, Больичный, Отпуск, etc.
                            Log.Logger.Error($"Cannot conver {projCodeAsStr} to int");
                            projCode = -1;
                        }

                        var estAsStr = rec.Split("=")[1].Replace(",", ".");

                        var cultureInfo = (CultureInfo)CultureInfo.CurrentCulture.Clone();
                        cultureInfo.NumberFormat.CurrencyDecimalSeparator = ".";

                        if (!float.TryParse(estAsStr, NumberStyles.Any, cultureInfo, out float est))
                        {
                            Log.Logger.Error($"Cannot convert {estAsStr} to float");
                            continue;
                        }

                        // check if one cell in Excel has two records for the same project
                        var record = weekPlan.Projects.FirstOrDefault(i => i.ProjectName == projCodeAsStr);
                        if (record != null)
                        {
                            record.Hours += est * 40;
                            record.Hours = Math.Round(record.Hours, 2);
                        }
                        else
                        {
                            weekPlan.Projects.Add(new SharepointProjectPlan
                            {
                                Hours = Math.Round(est * 40, 2),
                                ProjectName = projCodeAsStr,
                                ProjectCode = projCode > 0 ? projCode : null
                            });
                        }
                    }

                    userPlan.Weeks.Add(weekPlan);
                    weekIdx++;
                }

                res.Add(userPlan);
                rowIdx++;
            }

            return res;
        }


    }
}