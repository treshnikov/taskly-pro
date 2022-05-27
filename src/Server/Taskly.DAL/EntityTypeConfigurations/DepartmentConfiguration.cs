
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
    {
        public void Configure(EntityTypeBuilder<Department> builder)
        {
            builder.ToTable("Departments");
            builder.HasIndex(u => u.Id).IsUnique();
            builder.HasIndex(u => u.ParentDepartmentId);
            builder.HasOne(u => u.ParentDepartment);
        }
    }

}