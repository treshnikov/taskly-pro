using System.Text.Json;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;
using Taskly.Domain;
using Serilog;
using System.Globalization;
using ClosedXML.Excel;

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

        public async Task<MediatR.Unit> Handle(ImportDataFromJsonRequest request, CancellationToken cancellationToken)
        {
            try
            {
                Extract(request, out DepartmentJson[] deps, out UserJson[] users, out ProjectJson[] projects);

                await UpdateUsers(users, cancellationToken);
                await UpdateUserPositions(users, cancellationToken);
                await UpdateDepartments(deps, cancellationToken);
                await UpdateUserUnitLinks(users, deps, cancellationToken);
                await UpdateProjects(projects, cancellationToken);
                await UpdateProjectTasks(request, cancellationToken);

                return MediatR.Unit.Value;
            }
            catch (Exception e)
            {
                throw;
            }

        }

        private async Task UpdateProjectTasks(ImportDataFromJsonRequest request, CancellationToken cancellationToken)
        {
            var path = Directory.GetParent(typeof(ImportDataFromJsonRequestHandler).Assembly.Location)!.FullName;
            var projectTasksFileName = Path.Combine(path, request.ProjectTasksFileName);
            var tasks = ParseTasks(projectTasksFileName);

            using var transaction = _dbContext.Database.BeginTransaction();

            var dbProjects = _dbContext.Projects
                .Include(p => p.Tasks)
                .ToList();

            foreach (var p in dbProjects)
            {
                p.Tasks.Clear();
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            foreach (var t in tasks)
            {
                var dbProject = dbProjects.FirstOrDefault(i => i.Id == t.ProjectId);
                if (dbProject == null)
                {
                    Log.Logger.Warning($"Cannot import tasks for projectId={t.ProjectId}");
                    continue;
                }

                var newTask = new ProjectTask
                {
                    Id = Guid.NewGuid(),
                    ProjectId = dbProject.Id,
                    UnitEstimations = new List<ProjectTaskUnitEstimation>(),
                    Description = t.Description,
                    Start = t.Start,
                    End = t.End,
                };

                _dbContext.ProjectTasks.Add(newTask);

                dbProject.Tasks.Add(newTask);
                _dbContext.Projects.Update(dbProject);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        internal class ProjectTaskInfoXlsx
        {
            public int ProjectId { get; set; }
            public string Description { get; set; }
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
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

                // project can contains . symbol - 985.1 
                // we need to take only the first part
                var projectIdAsStr = worksheet.Cell(rowIdx, 3).GetValue<string>();
                projectIdAsStr = projectIdAsStr.Split(".")[0];
                if (!int.TryParse(projectIdAsStr, out int projectId))
                {
                    Console.WriteLine($"Skip {projectIdAsStr}");
                    continue;
                }

                var task = worksheet.Cell(rowIdx, 9).GetValue<string>();

                if (string.IsNullOrWhiteSpace(task))
                {
                    break;
                }

                var startStr = worksheet.Cell(rowIdx, 12).GetValue<string>();
                var start = string.IsNullOrWhiteSpace(startStr)
                    ? DateTime.Today.AddDays(-1)
                    : DateTime.Parse(startStr);
                var endStr = worksheet.Cell(rowIdx, 13).GetValue<string>();
                var end = string.IsNullOrWhiteSpace(endStr)
                    ? DateTime.Today
                    : DateTime.Parse(endStr);

                res.Add(new ProjectTaskInfoXlsx
                {
                    ProjectId = projectId,
                    Description = task,
                    Start = start,
                    End = end
                });
            }

            return res.ToArray();
        }

        private async Task UpdateProjects(ProjectJson[] projects, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbProjects = _dbContext.Projects.ToList();
            var dbUsers = _dbContext.Users.ToList();
            var dbCustomers = _dbContext.Customers.ToList();
            var dbUnits = _dbContext.Units.ToList();

            var newProjects = new List<Project>();
            foreach (var p in projects)
            {
                Log.Logger.Debug($"Handle project ${JsonSerializer.Serialize(p)}");

                var dbProject = dbProjects.FirstOrDefault(i => i.Id == p.project_id);
                var newProject = newProjects.FirstOrDefault(i => i.Id == p.project_id);

                var company = dbUnits.FirstOrDefault(i => i.Name == p.company);
                var start = DateTime.ParseExact(p.start_stop_dates.Split(" ")[0], "dd.MM.yyyy", CultureInfo.InvariantCulture);
                var end = DateTime.ParseExact(p.start_stop_dates.Split(" ")[2], "dd.MM.yyyy", CultureInfo.InvariantCulture);
                DateTime? closeDate = string.IsNullOrWhiteSpace(p.close_date) ? null : DateTime.ParseExact(p.close_date, "dd.MM.yyyy", CultureInfo.InvariantCulture);
                var pm = dbUsers.FirstOrDefault(i => i.Name == p.project_manager);
                var lead = dbUsers.FirstOrDefault(i => i.Name == p.lead_engineer);
                var isOpened = !string.IsNullOrWhiteSpace(p.opened) && (p.opened.ToLower() == "да");
                var customer = dbCustomers.FirstOrDefault(i => i.Name == p.customer);
                if (customer == null)
                {
                    customer = new Customer
                    {
                        Name = p.customer
                    };
                    dbCustomers.Add(customer);
                    _dbContext.Customers.Add(customer);
                }

                if (dbProject == null && newProject == null)
                {
                    newProjects.Add(new Project
                    {
                        Id = p.project_id,
                        ShortName = p.short_name,
                        Name = p.name,
                        IsOpened = isOpened,
                        Company = company,
                        Start = start,
                        End = end,
                        CloseDate = closeDate,
                        ProjectManager = pm,
                        ChiefEngineer = lead,
                        Customer = customer,
                        Contract = p.contract
                    });
                }
                else
                {
                    dbProject.ShortName = p.short_name;
                    dbProject.Name = p.name;
                    dbProject.IsOpened = isOpened;
                    dbProject.Company = company;
                    dbProject.Start = start;
                    dbProject.End = end;
                    dbProject.CloseDate = closeDate;
                    dbProject.ProjectManager = pm;
                    dbProject.ChiefEngineer = lead;
                    dbProject.Customer = customer;
                    dbProject.Contract = p.contract;

                    _dbContext.Projects.Update(dbProject);
                }
            }
            _dbContext.Projects.AddRange(newProjects);
            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private async Task UpdateUserUnitLinks(UserJson[] users, DepartmentJson[] deps, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbDeps = await _dbContext.Units.Include(u => u.UserUnits).ToListAsync(cancellationToken: cancellationToken);
            var dbUsers = await _dbContext.Users.Include(u => u.UserUnits).ThenInclude(u => u.UserPosition).ToListAsync(cancellationToken: cancellationToken);
            var dpUserPositions = await _dbContext.UserePositions.ToListAsync(cancellationToken);
            foreach (var u in users)
            {
                if (!u.DepartmentId.HasValue)
                {
                    continue;
                }

                Log.Logger.Debug($"Handle {u.lastname}");
                var dbUser = dbUsers.First(i => i.Email == u.email);
                var dbDep = dbDeps.First(i => i.Code == u.DepartmentId);
                if (dbUser.UserUnits == null)
                {
                    dbUser.UserUnits = new List<UserUnit>();
                }

                var dbUserUnit = dbUser.UserUnits.FirstOrDefault(i => i.User == dbUser && i.Unit == dbDep);
                if (dbUserUnit == null)
                {
                    dbUserUnit = new UserUnit
                    {
                        Id = Guid.NewGuid(),
                        Rate = 1,
                        Unit = dbDep,
                        User = dbUser,
                        UserPosition = dpUserPositions.First(i => i.Name == u.title),
                        Comment = u.TypeName
                    };

                    _dbContext.UserUnits.Add(dbUserUnit);
                    dbUser.UserUnits.Add(dbUserUnit);
                }
                else
                {
                    dbUserUnit.Rate = 1;
                    dbUserUnit.UserPosition = dpUserPositions.First(i => i.Name == u.title);
                    dbUserUnit.Comment = u.TypeName;
                }

                _dbContext.Users.Update(dbUser);
            }
            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private async Task UpdateDepartments(DepartmentJson[] deps, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbDeps = _dbContext.Units.ToList();
            var newDeps = new List<Domain.Unit>();
            foreach (var d in deps)
            {
                var dbDep = dbDeps.FirstOrDefault(i => i.Code == d.prj_company_ID);
                var newDep = newDeps.FirstOrDefault(i => i.Code == d.prj_company_ID);
                if (dbDep == null && newDep == null)
                {
                    Log.Logger.Debug($"Handle {d.name} with parent = {d.parent}");
                    newDeps.Add(new Domain.Unit
                    {
                        Id = Guid.NewGuid(),
                        Code = d.prj_company_ID,
                        Name = d.name,
                        OrderNumber = d.order_number,
                        ShortName = d.short_name,
                    });
                }
                else
                {
                    if (dbDep != null)
                    {
                        dbDep.ShortName = d.short_name;
                        dbDep.OrderNumber = d.order_number;
                        _dbContext.Units.Update(dbDep);
                    }
                }
            }
            _dbContext.Units.AddRange(newDeps);
            await _dbContext.SaveChangesAsync(cancellationToken);

            // update parent departments
            dbDeps = await _dbContext.Units.ToListAsync(cancellationToken);
            foreach (var d in deps)
            {
                if (!d.parent.HasValue)
                {
                    continue;
                }

                var dpDep = dbDeps.First(i => i.Code == d.prj_company_ID);
                dpDep.ParentUnit = dbDeps.First(i => i.Code == d.parent);
                _dbContext.Units.Update(dpDep);
            }
            await _dbContext.SaveChangesAsync(cancellationToken);

            transaction.Commit();
        }

        private async Task UpdateUsers(UserJson[] users, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbUsers = _dbContext.Users.ToList();
            var newUsers = new List<User>();
            foreach (var u in users)
            {
                var userName = $"{u.lastname} {u.firstname} {u.middlename}";
                var dbUser = dbUsers.FirstOrDefault(i => i.Email == u.email && i.Name == userName);
                var newUser = newUsers.FirstOrDefault(i => i.Email == u.email && i.Name == userName);
                if (dbUser == null && newUser == null)
                {
                    newUsers.Add(new User
                    {
                        Name = userName,
                        Password = BCrypt.Net.BCrypt.HashPassword(DefaultPasswordForNewUsers),
                        Id = Guid.NewGuid(),
                        Email = u.email
                    });
                }
            }
            _dbContext.Users.AddRange(newUsers);
            await _dbContext.SaveChangesAsync(cancellationToken);
            transaction.Commit();
        }

        private async Task UpdateUserPositions(UserJson[] users, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbUserPositions = _dbContext.UserePositions.ToList();
            var newUserPositions = new List<UserPosition>();
            foreach (var u in users)
            {
                var dbUserPosition = dbUserPositions.FirstOrDefault(i => i.Name == u.title);
                var newUserPosition = newUserPositions.FirstOrDefault(i => i.Name == u.title);
                if (dbUserPosition == null && newUserPosition == null)
                {
                    newUserPositions.Add(new UserPosition
                    {
                        Id = Guid.NewGuid(),
                        Name = u.title,
                        Ident = ConvertTitleToIdent(u.title)
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

            return null;
        }

        private void Extract(ImportDataFromJsonRequest request, out DepartmentJson[] deps, out UserJson[] users, out ProjectJson[] projects)
        {
            var path = Directory.GetParent(typeof(ImportDataFromJsonRequestHandler).Assembly.Location)!.FullName;
            var departmentFileName = Path.Combine(path, request.DepartmentsFileName);
            var usersFileName = Path.Combine(path, request.UsersFileName);
            var projectsFileName = Path.Combine(path, request.ProjectsFileName);
            var projectTasksFileName = Path.Combine(path, request.ProjectTasksFileName);

            if (!File.Exists(departmentFileName))
            {
                throw new NotFoundException($"Cannot find {departmentFileName}");
            }

            if (!File.Exists(usersFileName))
            {
                throw new NotFoundException($"Cannot find {usersFileName}");
            }

            if (!File.Exists(projectsFileName))
            {
                throw new NotFoundException($"Cannot find {projectsFileName}");
            }

            if (!File.Exists(projectTasksFileName))
            {
                throw new NotFoundException($"Cannot find {projectTasksFileName}");
            }

            deps = JsonSerializer.Deserialize<DepartmentJson[]>(File.ReadAllText(departmentFileName));
            users = JsonSerializer.Deserialize<UserJson[]>(File.ReadAllText(usersFileName));
            projects = JsonSerializer.Deserialize<ProjectJson[]>(File.ReadAllText(projectsFileName));
        }
    }

    /*
        { 
        "prj_company_ID":136,
        "name":"Отдел по работе с клиентами",
        "order_number":151,
        "parent":189,
        "short_name":""
        }
    */
    public class DepartmentJson
    {
        public int prj_company_ID { get; set; }
        public string name { get; set; }
        public int order_number { get; set; }
        public int? parent { get; set; }
        public string short_name { get; set; }
    }

    /*
        { 
        "id":532,
        "firstname":"Александр",
        "middlename":"Сергеевич",
        "lastname":"...",
        "email":"....",
        "title":"Ведущий эксперт",
        "TypeName":"Основная",
        "name":"Служба внедрения",
        "DepartmentId":15
        }
    */
    internal class UserJson
    {
        public int id { get; set; }
        public string firstname { get; set; }
        public string middlename { get; set; }
        public string lastname { get; set; }
        public string email { get; set; }
        public string title { get; set; }
        public string TypeName { get; set; }
        public string name { get; set; }
        public int? DepartmentId { get; set; }
    }

    /*
    {
        "project_id": 256,
        "short_name": "РусГидро КГЭС САУ ГА",
        "name": "Замена релейных защит, регуляторов, технологической автоматики,  панели управления на микропроцессорные системы САУ гидроагрегатов",
        "opened": "",
        "company": "НВФ СМС",
        "start_stop_dates": "20.06.2011 - 31.12.2015",
        "close_date": "",
        "project_manager": "Кашапов Ильяс Динаратович",
        "lead_engineer": "Аболмасов Виктор Иванович",
        "customer": "Камская ГЭС, ОАО",
        "contract": "№ 222/11 от 03.06.2011 г."
    }
    */
    internal class ProjectJson
    {
        public int project_id { get; set; }
        public string short_name { get; set; }
        public string name { get; set; }
        public string opened { get; set; }
        public string? company { get; set; }
        public string start_stop_dates { get; set; }
        public string? close_date { get; set; }
        public string? project_manager { get; set; }
        public string? lead_engineer { get; set; }
        public string? customer { get; set; }
        public string? contract { get; set; }
    }


}