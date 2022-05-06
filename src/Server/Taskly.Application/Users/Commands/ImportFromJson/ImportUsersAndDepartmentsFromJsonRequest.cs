using MediatR;

namespace Taskly.Application.Users
{
    public class ImportUsersAndDepartmentsFromJsonRequest : IRequest
    {
        public string UsersFileName { get; set; } = "users.json";
        public string DepartmentsFileName { get; set; } = "departments.json";
    }
}