using System.Text.Json;
using System.Text.Json.Serialization;

namespace Taskly.WebApi.Common;

public class DateTimeToNumberJsonConverter : JsonConverter<DateTime>
{
	public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
	{
		var dateAsNumber = reader.GetInt64();
		DateTime epoch = new(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc); ;
		return epoch.Add(TimeSpan.FromMilliseconds(dateAsNumber)).ToLocalTime();
	}

	public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
	{
		DateTime epoch = DateTime.UnixEpoch;
		TimeSpan ts = value.Subtract(epoch);
		double unixTimeMilliseconds = ts.TotalMilliseconds;
		writer.WriteNumberValue((long)unixTimeMilliseconds);
	}
}