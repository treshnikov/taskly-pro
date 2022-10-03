using MediatR;

namespace Taskly.Application.Users
{
    public class ImportDataFromIntranetRequest : IRequest
    {
        public IntranetDbConnectionSettings IntranetDbConnectionSettings { get; init; }
        public ImportDataFromIntranetRequest(IntranetDbConnectionSettings intranetDbConnectionSettings)
        {
            IntranetDbConnectionSettings = intranetDbConnectionSettings;
        }
    }
}