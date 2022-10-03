using MediatR;

namespace Taskly.Application.Users
{
    public class ImportDataFromIntranetRequest : IRequest
    {
        public IntranetDbConnectionSettings IntranetDbConnectionSettings { get; init; }
        public string UsersFileName { get; set; } = "import/users.json";
        public string ProjectsFileName { get; set; } = "import/projects.json";
        public string ProjectTasksFileName { get; set; } = "import/project_tasks.xlsx";

        public ImportDataFromIntranetRequest(IntranetDbConnectionSettings intranetDbConnectionSettings)
        {
            IntranetDbConnectionSettings = intranetDbConnectionSettings;
        }
    }
}