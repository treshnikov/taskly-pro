
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class TasklyUserConfiguration : IEntityTypeConfiguration<TasklyUser>
    {
        public void Configure(EntityTypeBuilder<TasklyUser> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(u => u.Id);
            builder.HasIndex(u => u.Id).IsUnique();
        }
    }
}