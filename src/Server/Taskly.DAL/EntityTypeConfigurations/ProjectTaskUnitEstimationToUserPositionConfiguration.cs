
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class ProjectTaskUnitEstimationToUserPositionConfiguration : IEntityTypeConfiguration<ProjectTaskUnitEstimationToUserPosition>
    {
        public void Configure(EntityTypeBuilder<ProjectTaskUnitEstimationToUserPosition> builder)
        {
            builder.ToTable("ProjectEstimations");
            builder.HasIndex(u => u.Id).IsUnique();
            builder.HasIndex(u => new {u.ProjectTaskUnitEstimationID, u.UserPositionId}).IsUnique();
        }
    }

}