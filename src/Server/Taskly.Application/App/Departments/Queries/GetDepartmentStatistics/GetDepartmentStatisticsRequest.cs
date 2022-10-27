using MediatR;

namespace Taskly.Application.Departments.Queries.GetDepartmentStatistics;

public class GetDepartmentStatisticsRequest : IRequest<DepartmentStatisticsVm>
{
	public Guid DepartmentId { get; set; }
	public DateTime Start { get; set; }
	public DateTime End { get; set; }
}