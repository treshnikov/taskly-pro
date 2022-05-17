using MediatR;

namespace Taskly.Application.Users
{
    public class ImportDataFromJsonRequest : IRequest
    {
        public string UsersFileName { get; set; } = "users.json";
        public string DepartmentsFileName { get; set; } = "departments.json";
        public string ProjectsFileName { get; set; } = "projects.json";
        public string ProjectTasksFileName { get; set; } = "project_tasks.xlsx";
    }
}