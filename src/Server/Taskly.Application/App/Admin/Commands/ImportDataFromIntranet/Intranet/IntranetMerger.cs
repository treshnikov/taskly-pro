using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;
using Taskly.Domain;

namespace Taskly.Application.Users
{
    public class IntranetMerger
    {
        private const string DefaultPasswordForNewUsers = "123456";

        private readonly ITasklyDbContext _dbContext;

        public IntranetMerger(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task UpdateProjects(IntranetProject[] projects, CancellationToken cancellationToken)
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

        public async Task UpdateUserDepartmentLinks(IntranetUser[] users, IntranetDepartment[] deps, CancellationToken cancellationToken)
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

        public async Task UpdateDepartments(IntranetDepartment[] deps, CancellationToken cancellationToken)
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

        public async Task UpdateUsers(IntranetUser[] users, CancellationToken cancellationToken)
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

        public async Task UpdateUserPositions(IntranetUser[] users, CancellationToken cancellationToken)
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
        
    }
}