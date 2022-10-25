
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class ProjectTaskUserPositionEstimationConfiguration : IEntityTypeConfiguration<ProjectTaskUserPositionEstimation>
    {
        public void Configure(EntityTypeBuilder<ProjectTaskUserPositionEstimation> builder)
        {
            builder.ToTable("ProjectTaskUserPositionEstimation");
            builder.HasKey(u => u.Id);
            
            // check https://github.com/npgsql/efcore.pg/issues/971
            builder.Property(i => i.Id).IsRequired().ValueGeneratedNever();
            builder.HasOne(u => u.UserPosition);
        }
    }

}