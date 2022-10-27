
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations;

public class UserDepartmentConfiguration : IEntityTypeConfiguration<UserDepartment>
{
	public void Configure(EntityTypeBuilder<UserDepartment> builder)
	{
		builder.ToTable("UserDepartments");
		builder.HasIndex(u => u.Id).IsUnique();
		builder.HasIndex(u => new { u.UserId, u.DepartmentId }).IsUnique();
	}
}