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
            return MediatR.Unit.Value;
        }

        private async Task UpdateUsers(UserJson[] users, CancellationToken cancellationToken)
        {
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                var dbUsers = _dbContext.Users.ToList();
                var newUsers = new List<User>();
                foreach (var u in users)
                {
                    var userName = $"{u.lastname} {u.firstname} {u.middlename}";
                    Log.Logger.Debug($"Handle user [{userName}][{u.email}]");

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
                        Log.Logger.Debug($"Added");
                    }
                    else
                    {
                        // userDb.Name = $"{u.lastname} {u.firstname} {u.middlename}";
                        // _dbContext.Users.Update(userDb);
                    }
                }
                _dbContext.Users.AddRange(newUsers);
                await _dbContext.SaveChangesAsync(cancellationToken);
                transaction.Commit();
            }
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