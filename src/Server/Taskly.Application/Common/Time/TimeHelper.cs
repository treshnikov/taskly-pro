namespace Taskly.Application.Common.Time
{
    public static class TimeHelper
    {
        public static bool DoTwoTimeSegmentsIntersect(DateTime aStart, DateTime aEnd, DateTime bStart, DateTime bEnd)
        {
            /* the idea of getting intersecting time periods
              request          rs|-------------|re         rs|-------------|re
              task        ts|-------|te               ts|--------------------------|te
              rs >= ts && rs <= te


              request          rs|-------------|re              rs|----------------------|re
              task                       ts|-------|te               ts|-----------|te
              rs <= ts && re >= ts
            */
            return (aStart >= bStart && aStart <= bEnd) || (aStart <= bStart && aEnd >= bStart);
        }

    }
}