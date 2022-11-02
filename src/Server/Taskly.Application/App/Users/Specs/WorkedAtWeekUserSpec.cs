using Taskly.Application.Common.Specs;
using Taskly.Domain;

namespace Taskly.Application.App.Users.Specs;

public class WorkedAtWeekUserSpec : Spec<User>
{
	public WorkedAtWeekUserSpec(DateTime monday)
		: base(u => u.HiringDate <= monday && (u.QuitDate == null || u.QuitDate > monday.AddDays(5)))
	{
	}
}