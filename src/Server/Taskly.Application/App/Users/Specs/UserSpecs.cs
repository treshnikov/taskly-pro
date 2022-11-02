using System.Linq.Expressions;
using Taskly.Application.Common.Specs;
using Taskly.Domain;

namespace Taskly.Application.App.Users.Specs;

public static class UserSpecs
{
	public static Spec<User> WorksInTheCompany => _worksInTheCompany;
	private static readonly Expression<Func<User, bool>> _worksInTheCompany = u => u.QuitDate == null;
	public static WorkedAtWeekUserSpec WorkedAtWeek(DateTime monday) => new(monday);
}