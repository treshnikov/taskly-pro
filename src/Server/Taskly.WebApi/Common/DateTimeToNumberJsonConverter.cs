using System.Text.Json;
using System.Text.Json.Serialization;

namespace Taskly.WebApi.Common
{
    public class DateTimeToNumberJsonConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var dateAsStr = reader.GetString();
            if (string.IsNullOrWhiteSpace(dateAsStr))
            {
                throw new ArgumentException("Cannot convert an empty string to DateTime.");
            }

            DateTime epoch = DateTime.UnixEpoch;
            return epoch.Add(TimeSpan.FromMilliseconds(long.Parse(dateAsStr)));
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            DateTime epoch = DateTime.UnixEpoch;
            TimeSpan ts = value.Subtract(epoch);
            double unixTimeMilliseconds = ts.TotalMilliseconds;
            writer.WriteNumberValue((long)unixTimeMilliseconds);
        }
    }

}