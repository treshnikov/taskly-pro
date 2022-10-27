using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taskly.Domain;

namespace Taskly.DAL;

public class VacationDayConfiguration : IEntityTypeConfiguration<VacationDay>
{
	public void Configure(EntityTypeBuilder<VacationDay> builder)
	{
		builder.ToTable("Vacations");
		builder.HasKey(i => i.Id);
		builder.HasOne(i => i.User);
	}
}