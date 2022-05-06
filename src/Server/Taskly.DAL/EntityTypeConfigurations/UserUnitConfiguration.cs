
using Taskly.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Taskly.DAL.EntityTypeConfigurations
{
    public class UserUnitConfiguration : IEntityTypeConfiguration<UserUnit>
    {
        public void Configure(EntityTypeBuilder<UserUnit> builder)
        {
            builder.ToTable("UserUnits");
            builder.HasIndex(u => u.Id).IsUnique();
            builder.HasIndex(u => new {u.UserId, u.UnitId}).IsUnique();
        }
    }

}