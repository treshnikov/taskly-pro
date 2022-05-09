using System.Text.Json;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Taskly.Application.Common.Exceptions;
using Taskly.Application.Interfaces;
using Taskly.Domain;
using Serilog;

namespace Taskly.Application.Users
{
    public class ImportUsersAndDepartmentsFromJsonRequestHandler : IRequestHandler<ImportUsersAndDepartmentsFromJsonRequest>
    {
        private const string DefaultPasswordForNewUsers = "123456";
        private readonly ITasklyDbContext _dbContext;
        public ImportUsersAndDepartmentsFromJsonRequestHandler(ITasklyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<MediatR.Unit> Handle(ImportUsersAndDepartmentsFromJsonRequest request, CancellationToken cancellationToken)
        {
            Extract(request, out DepartmentJson[] deps, out UserJson[] users);

            await UpdateUsers(users, cancellationToken);
            await UpdateDepartments(deps, cancellationToken);
            await UpdateUserUnitLinks(users, deps, cancellationToken);

            return MediatR.Unit.Value;
        }

        private async Task UpdateUserUnitLinks(UserJson[] users, DepartmentJson[] deps, CancellationToken cancellationToken)
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            var dbDeps = await _dbContext.Units.Include(u => u.UserUnits).ToListAsync(cancellationToken: cancellationToken);
            var dbUsers = await _dbContext.Users.Include(u => u.UserUnits).ToListAsync(cancellationToken: cancellationToken);
            foreach (var u in users)
            {
                if (!u.DepartmentId.HasValue)
                {
                    continue;
                }

                Log.Logger.Debug($"Handle {u.lastname}");
                var dbUser = dbUsers.First(i => i.Email == u.email);
                var depName = deps.First(i => i.prj_company_ID == u.DepartmentId).name;
                var dbDep = dbDeps.First(i => i.Name == depName);
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
                        UserTitle = u.title,
                        Comment = u.TypeName
                    };

                    _dbContext.UserUnits.Add(dbUserUnit);
                    dbUser.UserUnits.Add(dbUserUnit);
                }
                else
                {
                    dbUserUnit.Rate = 1;
                    dbUserUnit.UserTitle = u.title;
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
                var dbDep = dbDeps.FirstOrDefault(i => i.Name == d.name);
                var newDep = newDeps.FirstOrDefault(i => i.Name == d.name);
                if (dbDep == null && newDep == null)
                {
                    Log.Logger.Debug($"Handle {d.name} with parent = {d.parent}");
                    newDeps.Add(new Domain.Unit
                    {
                        Id = Guid.NewGuid(),
                        Name = d.name,
                        OrderNumber = d.order_number,
                        ShortName = d.short_name,
                    });
                }
                else
                {
                    if (dbDep != null)
                    {
                        dbDep.ShortName = d.name;
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

                dbDeps.First(i => i.Name == d.name).ParentUnit = dbDeps.First(i => i.Name == deps.First(x => x.prj_company_ID == d.parent).name);
                _dbContext.Units.Update(dbDeps.First(i => i.Name == d.name));
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

        private void Extract(ImportUsersAndDepartmentsFromJsonRequest request, out DepartmentJson[] deps, out UserJson[] users)
        {
            var path = Directory.GetParent(typeof(ImportUsersAndDepartmentsFromJsonRequestHandler).Assembly.Location)!.FullName;
            var departmentFileName = Path.Combine(path, request.DepartmentsFileName);
            var usersFileName = Path.Combine(path, request.UsersFileName);

            if (!File.Exists(departmentFileName))
            {
                throw new NotFoundException($"Cannot find {departmentFileName}");
            }

            if (!File.Exists(usersFileName))
            {
                throw new NotFoundException($"Cannot find {usersFileName}");
            }

            deps = JsonSerializer.Deserialize<DepartmentJson[]>(File.ReadAllText(departmentFileName));
            users = JsonSerializer.Deserialize<UserJson[]>(File.ReadAllText(usersFileName));
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

}