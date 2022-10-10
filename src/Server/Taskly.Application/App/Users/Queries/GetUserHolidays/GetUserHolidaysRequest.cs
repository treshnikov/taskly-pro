using MediatR;
using Taskly.Application.Calendar;

namespace Taskly.Application.Users
{
    public class GetUserHolidaysRequest : IRequest<IEnumerable<DayInfo>>
    {
        public string UserName { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }

}
