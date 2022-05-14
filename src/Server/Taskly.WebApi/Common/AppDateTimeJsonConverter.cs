using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Taskly.WebApi.Common
{
    public class AppDateTimeJsonConverter : JsonConverter<DateTime>
    {
        private const string _format = "dd.MM.yyyy";

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            DateTime.TryParseExact(reader.GetString(), _format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result);
            return result;
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(_format, CultureInfo.InvariantCulture));
        }
    }
}