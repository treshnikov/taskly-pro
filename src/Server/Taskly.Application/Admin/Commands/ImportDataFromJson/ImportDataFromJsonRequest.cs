using MediatR;

namespace Taskly.Application.Users
{
    public class ImportDataFromJsonRequest : IRequest
    {
        public string UsersFileName { get; set; } = "import/users.json";
        public string DepartmentsFileName { get; set; } = "import/departments.json";
        public string ProjectsFileName { get; set; } = "import/projects.json";
        public string ProjectTasksFileName { get; set; } = "import/project_tasks.xlsx";
    }
}