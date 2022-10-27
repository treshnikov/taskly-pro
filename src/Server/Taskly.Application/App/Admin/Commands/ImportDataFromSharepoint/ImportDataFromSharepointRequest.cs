using MediatR;

namespace Taskly.Application.Users;

public class ImportDataFromSharepointRequest : IRequest
{
	public string ProjectTasksFileName { get; set; } = "import/Сводный_шаблон.xlsm";
}