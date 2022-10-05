using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taskly.Domain;

namespace Taskly.DAL
{
    public class CalendarDayConfiguration : IEntityTypeConfiguration<CalendarDay>
    {
        public void Configure(EntityTypeBuilder<CalendarDay> builder)
        {
            builder.ToTable("Calendar");
            builder.HasIndex(i => i.Date);
            builder.HasKey(i => new { i.Date, i.DayType });
        }
    }
}