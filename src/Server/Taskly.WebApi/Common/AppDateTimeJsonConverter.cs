using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Taskly.WebApi.Common
{
    public class AppDateTimeJsonConverter : JsonConverter<DateTime>
    {
        private const string _DateTimeFormat = "dd.MM.yyyy HH:mm:ss";
        private const string _DateFormat = "dd.MM.yyyy";

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            DateTime.TryParseExact(reader.GetString(), _DateTimeFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result);
            return result;
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            if (value.Hour == 0 && value.Minute == 0 && value.Second == 0 && value.Millisecond == 0)
            {
                writer.WriteStringValue(value.ToString(_DateFormat, CultureInfo.InvariantCulture));
            }
            else
            {
                writer.WriteStringValue(value.ToString(_DateTimeFormat, CultureInfo.InvariantCulture));
            }
        }
    }
}