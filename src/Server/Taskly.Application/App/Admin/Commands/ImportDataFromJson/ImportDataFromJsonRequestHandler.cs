/*
    Warning: code below is quite messy, it considers a very special format that is only used by my current employer. 
    A universal importer is not considered in this project. 
    Please eliminate this part of the code and add support for your format if needed. 
*/

using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;
using Serilog;
using System.Globalization;
using ClosedXML.Excel;
using MySqlConnector;

namespace Taskly.Application.Users
{
    public class ImportDataFromJsonRequestHandler : IRequestHandler<ImportDataFromJsonRequest>
    {
        private const string DefaultPasswordForNewUsers = "123456";
        private readonly ITasklyDbContext _dbContext;
        public ImportDataFromJsonRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(ImportDataFromJsonRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var intranetDbConnectionSettings = request.IntranetDbConnectionSettings;
                var builder = new MySqlConnectionStringBuilder
                {
                    Server = intranetDbConnectionSettings.Host,
                    Database = intranetDbConnectionSettings.DbName,
                    UserID = intranetDbConnectionSettings.User,
                    Password = intranetDbConnectionSettings.Password,
                    Port = intranetDbConnectionSettings.Port,
                    SslMode = MySqlSslMode.Disabled
                };

                using var intranetDbConnection = new MySqlConnection(builder.ConnectionString);
                await intranetDbConnection.OpenAsync(cancellationToken);

                var iDepartments = await LoadDepartmentsFromIntranetDbAsync(intranetDbConnection, cancellationToken);
                var iUsers = await LoadUsersFromIntranetDbAsync(intranetDbConnection, cancellationToken);
                var iProjects = await LoadProjectsFromIntranetDbAsync(intranetDbConnection, cancellationToken);

                await UpdateUsers(iUsers, cancellationToken);
                await UpdateUserPositions(iUsers, cancellationToken);
                await UpdateDepartments(iDepartments, cancellationToken);
                await UpdateUserDepartmentLinks(iUsers, iDepartments, cancellationToken);
                await UpdateProjects(iProjects, cancellationToken);

                //todo
                return Unit.Value;

                await UpdateProjectTasks(request, cancellationToken);

                await UpdateProjectPlan("import/ОП ДС.XLSX", 244, cancellationToken);
                await UpdateProjectPlan("import/ОП_АС.xlsx", 245, cancellationToken);

                await UpdateProjectPlan("import/АСУТПвН.xlsx", 243, cancellationToken);
                await UpdateProjectPlan("import/АСУТПвЭ.xlsx", 242, cancellationToken);
                await UpdateProjectPlan("import/ИБ_и_ОСР.XLSX", 233, cancellationToken);
                await UpdateProjectPlan("import/ПРСУ.XLSX", 176, cancellationToken);
                await UpdateProjectPlan("import/СУПП.xlsx", 234, cancellationToken);
                await UpdateProjectPlan("import/ЭМУ.xlsx", 179, cancellationToken);
                await UpdateProjectPlan("import/ЭТЛ.xlsx", 177, cancellationToken);
                await UpdateProjectPlan("import/ЭТО.xlsx", 178, cancellationToken);

                return Unit.Value;
            }
            catch (Exception e)
            {
                throw;
            }

        }

        private async Task<IntranetProject[]> LoadProjectsFromIntranetDbAsync(MySqlConnection conn, CancellationToken cancellationToken)
        {
            var res = new List<IntranetProject>();

            using var command = conn.CreateCommand();
            command.CommandText =
                "SELECT c.display_name, u2.name as gip_name, u2.email as gip_email, u.name as manager_name, u.email as manager_email, p.prj_project_ID, p.project_code, p.project_name, p.open, p.company_ID, p.date_from, p.date_to, p.date_to_fact, p.manager_ID, p.gip_ID, p.customer_ID, p.dogovor, p.internal FROM prj_reestr p  " +
                "join jos_users u on u.id = p.manager_ID " +
                "join jos_users u2 on u2.id = p.gip_ID " +
                "join civicrm_contact c on c.id = p.customer_ID ";

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                res.Add(new IntranetProject
                {
                    Id = reader.GetInt32("prj_project_ID"),
                    ShortName = reader.GetString("project_code"),
                    Name = reader.GetString("project_name"),
                    Opened = reader.GetInt32("open") == 1,
                    DepartmentId = reader.GetInt32("company_ID"),
                    Start = reader.GetDateTime("date_from"),
                    End = reader.GetDateTime("date_to"),
                    CloseDate = reader["date_to_fact"] == DBNull.Value ? null : reader.GetDateTime("date_to_fact"),
                    ManagerId = reader["manager_ID"] == DBNull.Value ? null : reader.GetInt32("manager_ID"),
                    LeadEngineerId = reader["gip_ID"] == DBNull.Value ? null : reader.GetInt32("gip_ID"),
                    CustomerName = reader.GetString("display_name"),
                    Contract = reader.GetString("dogovor"),
                    Internal = reader.GetInt32("internal") == 1,
                    ManagerEmail = reader["manager_email"] == DBNull.Value ? null : reader.GetString("manager_email"),
                    LeadEngineerEmail = reader["gip_email"] == DBNull.Value ? null : reader.GetString("gip_email")

                });
            }

            return res.ToArray();
        }

        private static async Task<IntranetUser[]> LoadUsersFromIntranetDbAsync(MySqlConnection conn, CancellationToken cancellationToken)
        {
            var res = new List<IntranetUser>();

            using var command = conn.CreateCommand();
            var sql =
                "SELECT u.cb_effectiverate, u.user_id, p.Title, u.firstname, u.middlename, u.lastname, u2.email, u.cb_departament_fact FROM jos_comprofiler u " +
                "join sms_position p on u.user_id = p.UserID and u.cb_departament_fact = p.DepartmentID " +
                "join jos_users u2 on u2.id = u.user_id " +
                "where u2.email is not null and u2.email <> '' ";

            command.CommandText = sql;

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                var userRateAsStr = reader["cb_effectiverate"] == DBNull.Value
                    ? ""
                    : reader.GetString("cb_effectiverate").Replace(",", ".");

                var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
                ci.NumberFormat.CurrencyDecimalSeparator = ".";
                if (!double.TryParse(userRateAsStr, NumberStyles.Any, ci, out double userRateAsFloat))
                {
                    userRateAsFloat = 0;
                }

                res.Add(new IntranetUser
                {
                    Id = reader.GetInt32("user_id"),
                    FirstName = reader.GetString("firstname"),
                    MiddleName = reader.GetString("middlename"),
                    LastName = reader.GetString("lastname"),
                    Email = reader.GetString("email"),
                    DepartmentId = reader.GetInt32("cb_departament_fact"),
                    Title = reader.GetString("Title"),
                    TimeRate = userRateAsFloat
                });
            }

            return res.ToArray();
        }

        private async Task UpdateProjectPlan(string fileName, int departmentCode, CancellationToken cancellationToken)
        {
            var path = Directory.GetParent(typeof(ImportDataFromJsonRequestHandler).Assembly.Location)!.FullName;
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
            List<UserPlan> plans = ExtractPlans(filePath);

            var dbUsers = await _dbContext.Users.Include(i => i.UserDepartments).ToListAsync(cancellationToken);
            var dbProjects = await _dbContext.Projects.AsNoTracking().ToListAsync(cancellationToken);
            foreach (var planItem in plans)
            {
                var user = dbUsers.FirstOrDefault(i => i.Name == planItem.UserName);
                if (user == null)
                {
                    Log.Error($"Cannot find user with name {planItem.UserName}");
                    continue;
                }

                // check that the user is included in the given department
                // if they don't then add them to with same position as in the other department
                if (!user.UserDepartments.Any(i => i.DepartmentId == dbDep.Id))
                {
                    var defaultPosition = user.UserDepartments.FirstOrDefault();
                    if (defaultPosition != null)
                    {
                        user.UserDepartments.Add(new UserDepartment
                        {
                            DepartmentId = dbDep.Id,
                            Rate = planItem.Rate,
                            UserId = user.Id,
                            UserPositionId = defaultPosition.UserPositionId,
                        });
                    }
                }
                else
                {
                    user.UserDepartments.OrderByDescending(i => i.Rate).First(i => i.DepartmentId == dbDep.Id).Rate = planItem.Rate;
                }

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

        private List<UserPlan> ExtractPlans(string filePath)
        {
            var res = new List<UserPlan>();

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

                var userPlan = new UserPlan
                {
                    UserName = userName,
                    Rate = userRateAsFloat,
                    Weeks = new List<WeekPlan>()
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

                    var weekPlan = new WeekPlan
                    {
                        WeekStart = weekStartAsDt,
                        Projects = new List<ProjectPlan>()
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
                        weekPlan.Projects.Add(new ProjectPlan
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

        private async Task UpdateProjectTasks(ImportDataFromJsonRequest request, CancellationToken cancellationToken)
        {
            var path = Directory.GetParent(typeof(ImportDataFromJsonRequestHandler).Assembly.Location)!.FullName;
            var projectTasksFileName = Path.Combine(path, request.ProjectTasksFileName);
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
                            Name = t.ProjectName,
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

        internal class ProjectTaskInfoXlsx
        {
            public int? ProjectId { get; set; }
            public string? ProjectName { get; set; }
            public ProjectType ProjectType { get; set; }
            public string Description { get; set; }
            public string Comment { get; set; }
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
            public string[] Estimations { get; set; }
        }
        private static ProjectTaskInfoXlsx[] ParseTasks(string projectTasksFileName)
        {
            var res = new List<ProjectTaskInfoXlsx>();
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

                res.Add(new ProjectTaskInfoXlsx
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
                                    projectTypeAsStr == "Серт." ||
                                    projectTypeAsStr == "Внутр.1" ||
                                    projectTypeAsStr == "Обучение" ||
                                    projectTypeAsStr == "Прочее" ||
                                    projectTypeAsStr == "Промышленная Сеть" ||
                                    projectTypeAsStr == "Пов.квалиф."
                                    ? ProjectType.Internal
                                    : ProjectType.External;
        }

        private async Task UpdateProjects(IntranetProject[] projects, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbProjects = _dbContext.Projects.ToList();
            var dbUsers = _dbContext.Users.ToList();
            var dbCustomers = _dbContext.Customers.ToList();
            var dbDeps = _dbContext.Departments.ToList();

            var newProjects = new List<Project>();
            foreach (var p in projects)
            {
                //Log.Logger.Debug($"Handle project ${JsonSerializer.Serialize(p)}");

                var dbProject = dbProjects.FirstOrDefault(i => i.Id == p.Id);
                var newProject = newProjects.FirstOrDefault(i => i.Id == p.Id);

                var company = dbDeps.FirstOrDefault(i => i.Code == p.DepartmentId);
                var pm = dbUsers.FirstOrDefault(i => i.Email == p.ManagerEmail);
                var lead = dbUsers.FirstOrDefault(i => i.Email == p.LeadEngineerEmail);
                var isOpened = p.Opened;
                var customer = dbCustomers.FirstOrDefault(i => i.Name == p.CustomerName);
                if (customer == null)
                {
                    customer = new Customer
                    {
                        Name = p.CustomerName
                    };
                    dbCustomers.Add(customer);
                    _dbContext.Customers.Add(customer);
                }

                var projectType = p.Internal
                    ? ProjectType.Internal
                    : ProjectType.External;

                if (dbProject == null && newProject == null)
                {
                    newProjects.Add(new Project
                    {
                        Id = p.Id,
                        ShortName = p.ShortName,
                        Name = p.Name,
                        IsOpened = isOpened,
                        Company = company,
                        Start = p.Start,
                        End = p.End,
                        Type = projectType,
                        CloseDate = p.CloseDate,
                        ProjectManager = pm,
                        ChiefEngineer = lead,
                        Customer = customer,
                        Contract = p.Contract
                    });
                }
                else
                {
                    dbProject.ShortName = p.ShortName;
                    dbProject.Name = p.Name;
                    dbProject.IsOpened = isOpened;
                    dbProject.Company = company;
                    dbProject.Start = p.Start;
                    dbProject.End = p.End;
                    dbProject.CloseDate = p.CloseDate;
                    dbProject.ProjectManager = pm;
                    dbProject.ChiefEngineer = lead;
                    dbProject.Customer = customer;
                    dbProject.Type = projectType;
                    dbProject.Contract = p.Contract;

                    _dbContext.Projects.Update(dbProject);
                }
            }
            _dbContext.Projects.AddRange(newProjects);
            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private async Task UpdateUserDepartmentLinks(IntranetUser[] users, IntranetDepartment[] deps, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbDeps = await _dbContext.Departments.Include(u => u.UserDepartments).ToListAsync(cancellationToken: cancellationToken);
            var dbUsers = await _dbContext.Users.Include(u => u.UserDepartments).ThenInclude(u => u.UserPosition).ToListAsync(cancellationToken: cancellationToken);
            var dpUserPositions = await _dbContext.UserePositions.ToListAsync(cancellationToken);
            foreach (var u in users)
            {
                //Log.Logger.Debug($"Handle {u.lastname}");
                var dbUser = dbUsers.First(i => i.Email == u.Email);
                var dbDep = dbDeps.First(i => i.Code == u.DepartmentId);
                if (dbUser.UserDepartments == null)
                {
                    dbUser.UserDepartments = new List<UserDepartment>();
                }

                var dbUserDep = dbUser.UserDepartments.FirstOrDefault(i => i.User == dbUser && i.Department == dbDep);
                if (dbUserDep == null)
                {
                    dbUserDep = new UserDepartment
                    {
                        Id = Guid.NewGuid(),
                        Rate = u.TimeRate,
                        Department = dbDep,
                        User = dbUser,
                        UserPosition = dpUserPositions.First(i => i.Name == u.Title),
                    };

                    _dbContext.UserDepartments.Add(dbUserDep);
                    dbUser.UserDepartments.Add(dbUserDep);
                }
                else
                {
                    dbUserDep.Rate = u.TimeRate;
                    dbUserDep.UserPosition = dpUserPositions.First(i => i.Name == u.Title);
                }

                _dbContext.Users.Update(dbUser);
            }
            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private async Task UpdateDepartments(IntranetDepartment[] deps, CancellationToken cancellationToken)
        {
            var depsForPlanning = new int[] { 141, 244, 245, 234, 176, 232, 233, 242, 243, 177, 198, 199, 178, 179, 239 };
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbDeps = _dbContext.Departments.ToList();
            var newDeps = new List<Domain.Department>();
            foreach (var d in deps)
            {
                var dbDep = dbDeps.FirstOrDefault(i => i.Code == d.Id);
                var newDep = newDeps.FirstOrDefault(i => i.Code == d.Id);
                if (dbDep == null && newDep == null)
                {
                    //Log.Logger.Debug($"Handle {d.name} with parent = {d.parent}");
                    newDeps.Add(new Domain.Department
                    {
                        Id = Guid.NewGuid(),
                        Code = d.Id,
                        Name = d.Name,
                        OrderNumber = d.OrderNumber,
                        ShortName = d.ShortName,
                        IncludeInWorkPlan = depsForPlanning.Contains(d.Id)
                    });
                }
                else
                {
                    if (dbDep != null)
                    {
                        dbDep.ShortName = d.ShortName;
                        dbDep.OrderNumber = d.OrderNumber;
                        dbDep.IncludeInWorkPlan = depsForPlanning.Contains(d.Id);

                        _dbContext.Departments.Update(dbDep);
                    }
                }
            }
            _dbContext.Departments.AddRange(newDeps);
            await _dbContext.SaveChangesAsync(cancellationToken);

            // update parent departments
            dbDeps = await _dbContext.Departments.ToListAsync(cancellationToken);
            foreach (var d in deps)
            {
                if (!d.ParentId.HasValue)
                {
                    continue;
                }

                var dpDep = dbDeps.First(i => i.Code == d.Id);
                dpDep.ParentDepartment = dbDeps.First(i => i.Code == d.ParentId);
                _dbContext.Departments.Update(dpDep);
            }
            await _dbContext.SaveChangesAsync(cancellationToken);

            transaction.Commit();
        }

        private async Task UpdateUsers(IntranetUser[] users, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbUsers = _dbContext.Users.ToList();
            var newUsers = new List<User>();
            foreach (var u in users)
            {
                var userName = $"{u.LastName} {u.FirstName} {u.MiddleName}";
                var dbUser = dbUsers.FirstOrDefault(i => i.Email == u.Email && i.Name == userName);
                var newUser = newUsers.FirstOrDefault(i => i.Email == u.Email && i.Name == userName);
                if (dbUser == null && newUser == null)
                {
                    newUsers.Add(new User
                    {
                        Id = Guid.NewGuid(),
                        Name = userName,
                        Password = BCrypt.Net.BCrypt.HashPassword(DefaultPasswordForNewUsers),
                        Email = u.Email
                    });
                }
            }
            _dbContext.Users.AddRange(newUsers);
            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private async Task UpdateUserPositions(IntranetUser[] users, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbUserPositions = _dbContext.UserePositions.ToList();
            var newUserPositions = new List<UserPosition>();
            foreach (var u in users)
            {
                var dbUserPosition = dbUserPositions.FirstOrDefault(i => i.Name == u.Title);
                var newUserPosition = newUserPositions.FirstOrDefault(i => i.Name == u.Title);
                if (dbUserPosition == null && newUserPosition == null)
                {
                    newUserPositions.Add(new UserPosition
                    {
                        Id = Guid.NewGuid(),
                        Name = u.Title,
                        Ident = ConvertTitleToIdent(u.Title)
                    });
                }
            }
            _dbContext.UserePositions.AddRange(newUserPositions);
            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private string? ConvertTitleToIdent(string title)
        {
            var lowerCaseTitle = title.ToLower();
            if (lowerCaseTitle.Contains("ведущий"))
            {
                return "ВИ";
            }

            if (lowerCaseTitle.Contains("главный") || lowerCaseTitle.Contains("старший"))
            {
                return "ГС";
            }

            if (lowerCaseTitle.Contains("начальник") || lowerCaseTitle.Contains("руководител")
                || lowerCaseTitle.Contains("заместитель") || lowerCaseTitle.Contains("директор"))
            {
                return "Рук";
            }

            if (lowerCaseTitle.Contains("1 категории"))
            {
                return "И1";
            }

            if (lowerCaseTitle.Contains("2 категории"))
            {
                return "И2";
            }

            if (lowerCaseTitle.Contains("3 категории") || lowerCaseTitle.Contains("техник") || lowerCaseTitle.Contains("писатель"))
            {
                return "И3";
            }

            if (lowerCaseTitle.Contains("электромонтажник 1 разряда"))
            {
                return "Мон1";
            }

            if (lowerCaseTitle.Contains("электромонтажник 2 разряда"))
            {
                return "Мон2";
            }

            if (lowerCaseTitle.Contains("электромонтажник 3 разряда"))
            {
                return "Мон3";
            }

            if (lowerCaseTitle.Contains("электромонтажник 4 разряда"))
            {
                return "Мон4";
            }

            if (lowerCaseTitle.Contains("электрогазосварщик 6 разряда"))
            {
                return "Св6";
            }

            if (lowerCaseTitle.Contains("электрогазосварщик 5 разряда"))
            {
                return "Св5";
            }

            if (lowerCaseTitle.Contains("электрогазосварщик 4 разряда"))
            {
                return "Св4";
            }

            if (lowerCaseTitle.Contains("электрогазосварщик 3 разряда"))
            {
                return "Св3";
            }

            if (lowerCaseTitle.Contains("электрогазосварщик 2 разряда"))
            {
                return "Св2";
            }

            if (lowerCaseTitle.Contains("электрогазосварщик 1 разряда"))
            {
                return "Св1";
            }

            return null;
        }

        private static async Task<IntranetDepartment[]> LoadDepartmentsFromIntranetDbAsync(MySqlConnection conn, CancellationToken cancellationToken)
        {
            var res = new List<IntranetDepartment>();

            using var command = conn.CreateCommand();
            command.CommandText = "SELECT name, prj_company_ID, parent, order_number, short_name FROM prj_company;";

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                res.Add(new IntranetDepartment
                {
                    Id = reader.GetInt32("prj_company_ID"),
                    ParentId = reader["parent"] == DBNull.Value ? null : reader.GetInt32("parent"),
                    Name = reader.GetString("name"),
                    ShortName = reader.GetString("short_name"),
                    OrderNumber = reader.GetInt32("order_number")
                });
            }

            return res.ToArray();
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
    }

    internal class UserPlan
    {
        public string UserName { get; set; }
        public double Rate { get; set; }
        public List<WeekPlan> Weeks { get; set; }
    }

    internal class WeekPlan
    {
        public DateTime WeekStart { get; set; }
        public List<ProjectPlan> Projects { get; set; }
    }

    internal class ProjectPlan
    {
        public int? ProjectCode { get; set; }
        public string ProjectName { get; set; }
        public float Hours { get; set; }
    }

}