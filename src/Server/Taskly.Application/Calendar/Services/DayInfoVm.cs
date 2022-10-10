using Taskly.Domain;

namespace Taskly.Application.Calendar
{
    public class DayInfo
    {
        public DateTime Date { get; set; }
        public CalendarDayType DayType { get; set; }
    }
}
