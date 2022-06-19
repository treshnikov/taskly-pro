using Taskly.Application.Projects;

namespace Taskly.WebApi.Models.Projects
{
    public class SaveProjectChangesVm
    {
        public int ProjectId { get; set; }
        public ProjectTaskVm[] Tasks { get; set; }
        
    }
}