using System.Text.Json;
using MediatR;
using Taskly.Application.Common.Exceptions;

namespace Taskly.Application.Users
{
    public class ImportUsersAndDepartmentsFromJsonRequestHandler : IRequestHandler<ImportUsersAndDepartmentsFromJsonRequest>
    {
        public Task<Unit> Handle(ImportUsersAndDepartmentsFromJsonRequest request, CancellationToken cancellationToken)
        {
            Extract(request, out DepartmentJson[] deps, out UserJson[] users);

            return Task.FromResult(Unit.Value);
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