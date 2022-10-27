using MediatR;

namespace Taskly.Application.Departments.Queries;

public class GetDepartmentUsersRequest : IRequest<DepartmentUserVm>
{
	public bool IncludeUsers { get; set; } = false;
}