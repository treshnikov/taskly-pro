
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class ProjectTaskDepartmentEstimationToUserPositionConfiguration : IEntityTypeConfiguration<ProjectTaskDepartmentEstimationToUserPosition>
    {
        public void Configure(EntityTypeBuilder<ProjectTaskDepartmentEstimationToUserPosition> builder)
        {
            builder.ToTable("ProjectEstimations");
            builder.HasIndex(u => u.Id).IsUnique();
            builder.HasOne(u => u.UserPosition);
        }
    }

}