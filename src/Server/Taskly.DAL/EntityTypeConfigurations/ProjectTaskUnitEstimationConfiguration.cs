
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class ProjectTaskUnitEstimationConfiguration : IEntityTypeConfiguration<ProjectTaskUnitEstimation>
    {
        public void Configure(EntityTypeBuilder<ProjectTaskUnitEstimation> builder)
        {
            builder.ToTable("ProjectUnitEstimations");
            builder.HasIndex(u => u.Id).IsUnique();
        }
    }

}