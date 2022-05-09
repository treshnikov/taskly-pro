
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.ToTable("Projects");
            builder.HasIndex(u => u.Id).IsUnique();
            builder.HasOne(u => u.ProjectManager);
            builder.HasOne(u => u.ChiefEngineer);
            builder.HasOne(u => u.Customer);
            builder.HasOne(u => u.Company);
        }
    }

}