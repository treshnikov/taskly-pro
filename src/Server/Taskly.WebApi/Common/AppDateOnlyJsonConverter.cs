using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Taskly.WebApi.Common
{
    public class AppDateOnlyJsonConverter : JsonConverter<DateOnly>
    {
        private const string _format = "dd.MM.yyyy";

        public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            DateOnly.TryParseExact(reader.GetString(), _format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result);
            return result;
        }

        public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(_format, CultureInfo.InvariantCulture));
        }
    }

}