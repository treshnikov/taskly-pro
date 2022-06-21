
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class ProjectTaskConfiguration : IEntityTypeConfiguration<ProjectTask>
    {
        public void Configure(EntityTypeBuilder<ProjectTask> builder)
        {
            builder.ToTable("ProjectTasks");
            builder.HasIndex(u => u.Id).IsUnique();
            builder.HasOne(u => u.Project).WithMany(u => u.Tasks).HasForeignKey(i => i.ProjectId).OnDelete(DeleteBehavior.Cascade);
        }
    }

}