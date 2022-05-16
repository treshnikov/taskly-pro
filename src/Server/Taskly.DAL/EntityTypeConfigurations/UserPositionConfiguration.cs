
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class UserPositionConfiguration : IEntityTypeConfiguration<UserPosition>
    {
        public void Configure(EntityTypeBuilder<UserPosition> builder)
        {
            builder.ToTable("UserPositions");
            builder.HasKey(i => i.Id);
            builder.HasIndex(i => i.Name).IsUnique();
        }
    }
    }