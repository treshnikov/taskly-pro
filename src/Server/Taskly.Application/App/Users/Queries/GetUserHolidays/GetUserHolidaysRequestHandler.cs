using MediatR;
using Taskly.Application.Calendar;

namespace Taskly.Application.Users;

public class GetUserHolidaysRequestHandler : IRequestHandler<GetUserHolidaysRequest, IEnumerable<DayInfo>>
{
	private readonly ICalendarService _calendarService;

	public GetUserHolidaysRequestHandler(ICalendarService calendarService)
	{
		_calendarService = calendarService;
	}
	public async Task<IEnumerable<DayInfo>> Handle(GetUserHolidaysRequest request, CancellationToken cancellationToken)
	{
		return await _calendarService.GetUserDaysInfoAsync(request.UserName, request.Start, request.End, cancellationToken);
	}
}

