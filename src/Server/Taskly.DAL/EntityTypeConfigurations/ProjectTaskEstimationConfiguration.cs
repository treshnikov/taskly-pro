
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations;

public class ProjectTaskEstimationConfiguration : IEntityTypeConfiguration<ProjectTaskEstimation>
{
	public void Configure(EntityTypeBuilder<ProjectTaskEstimation> builder)
	{
		builder.ToTable("ProjectTaskEstimations");
		builder.HasKey(u => u.Id);

		// check https://github.com/npgsql/efcore.pg/issues/971
		builder.Property(i => i.Id).IsRequired().ValueGeneratedNever();
		builder.HasOne(u => u.ProjectTask).WithMany(u => u.ProjectTaskEstimations).HasForeignKey(i => i.ProjectTaskId).OnDelete(DeleteBehavior.Cascade);
	}
}