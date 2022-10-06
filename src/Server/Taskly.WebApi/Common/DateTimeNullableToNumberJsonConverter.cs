using System.Text.Json;
using System.Text.Json.Serialization;

namespace Taskly.WebApi.Common
{
    public class DateTimeNullableToNumberJsonConverter : JsonConverter<DateTime?>
    {
        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if(reader.TryGetInt64(out long x))
               return DateTime.UnixEpoch.AddMilliseconds(x);

            var dateAsStr = reader.GetString();
            if (string.IsNullOrWhiteSpace(dateAsStr))
            {
                return null;
            }

            DateTime epoch = DateTime.UnixEpoch;
            return epoch.Add(TimeSpan.FromMilliseconds(long.Parse(dateAsStr)));
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (value == null || !value.HasValue)
            {
                writer.WriteNumberValue(0);
                return;
            }

            DateTime epoch = DateTime.UnixEpoch;
            TimeSpan ts = value.Value.Subtract(epoch);
            double unixTimeMilliseconds = ts.TotalMilliseconds;
            writer.WriteNumberValue((long)unixTimeMilliseconds);
        }
    }

}