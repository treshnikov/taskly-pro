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
                
            var dbProjects = await _dbContext.Projects.AsNoTracking().ToListAsync(cancellationToken);
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
                user.UserDepartments.Add(new UserDepartment{
                    DepartmentId = dbDep.Id,
                    Department = dbDep,
                    //Rate = planItem.Rate,
                    Rate = defaultPosition.Rate,
                    User = user,
                    UserId = user.Id,
                    UserPosition = defaultPosition.UserPosition,
                    UserPositionId = defaultPosition.Id
                });

                foreach (var w in planItem.Weeks)
                {
                    foreach (var pr in w.Projects)
                    {
                        if (!pr.ProjectCode.HasValue)
                        {
                            // create a new project
                            var projectWithNoCode = await _dbContext.Projects.FirstOrDefaultAsync(i => i.Name == pr.ProjectName, cancellationToken);
                            if (projectWithNoCode == null)
                            {
                                projectWithNoCode = new Project
                                {
                                    Name = pr.ProjectName,
                                    ShortName = pr.ProjectName,
                                    Type = ProjectType.Internal,
                                    Start = new DateTime(2000, 01, 01),
                                    End = new DateTime(3000, 01, 01),
                                    IsOpened = true,
                                    Contract = "",
                                    Tasks = new List<ProjectTask>()
                                };
                                _dbContext.Projects.Add(projectWithNoCode);
                                await _dbContext.SaveChangesAsync(cancellationToken);
                            }

                            var p = new DepartmentPlan
                            {
                                DepartmentId = dbDep.Id,
                                UserId = user.Id,
                                Hours = pr.Hours,
                                WeekStart = w.WeekStart,
                                Project = projectWithNoCode
                            };
                            _dbContext.DepartmentPlans.Add(p);
                        }
                        else
                        {
                            var proj = dbProjects.FirstOrDefault(i => i.Id == pr.ProjectCode.Value);
                            if (proj != null)
                            {
                                var p = new DepartmentPlan
                                {
                                    DepartmentId = dbDep.Id,
                                    UserId = user.Id,
                                    Hours = pr.Hours,
                                    WeekStart = w.WeekStart,
                                    ProjectId = proj.Id
                                };
                                _dbContext.DepartmentPlans.Add(p);
                            }
                            else
                            {
                                Log.Logger.Error($"Cannot find project with id={pr.ProjectCode.Value}");
                            }
                        }
                    }
                }
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private static List<SharepointUserPlan> ExtractPlans(string filePath)
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
                        weekPlan.Projects.Add(new SharepointProjectPlan
                        {
                            //todo - add coefficent depending on user position
                            Hours = est * 40,
                            ProjectName = projCodeAsStr,
                            ProjectCode = projCode > 0 ? projCode : null
                        });
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