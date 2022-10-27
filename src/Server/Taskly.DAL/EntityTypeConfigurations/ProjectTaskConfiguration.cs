
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations;

public class ProjectTaskConfiguration : IEntityTypeConfiguration<ProjectTask>
{
	public void Configure(EntityTypeBuilder<ProjectTask> builder)
	{
		builder.ToTable("ProjectTasks");
		builder.HasKey(u => u.Id);

		// check https://github.com/npgsql/efcore.pg/issues/971
		builder.Property(i => i.Id).IsRequired().ValueGeneratedNever();
		builder.HasOne(u => u.Project).WithMany(u => u.Tasks).HasForeignKey(i => i.ProjectId).OnDelete(DeleteBehavior.Cascade);
	}
}