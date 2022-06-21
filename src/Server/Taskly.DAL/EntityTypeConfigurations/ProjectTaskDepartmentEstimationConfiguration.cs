
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class ProjectTaskDepartmentEstimationConfiguration : IEntityTypeConfiguration<ProjectTaskDepartmentEstimation>
    {
        public void Configure(EntityTypeBuilder<ProjectTaskDepartmentEstimation> builder)
        {
            builder.ToTable("ProjectDepartmentEstimations");
            builder.HasIndex(u => u.Id).IsUnique();
            builder.HasOne(u => u.ProjectTask).WithMany(u => u.DepartmentEstimations).HasForeignKey(i => i.ProjectTaskId).OnDelete(DeleteBehavior.Cascade);
        }
    }

}