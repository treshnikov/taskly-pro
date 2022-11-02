using System.Globalization;
using MySqlConnector;
using Taskly.Domain;

namespace Taskly.Application.Users;

public class IntranetReader
{
	private readonly IntranetDbConnectionSettings _intranetDbConnectionSettings;

	public IntranetReader(IntranetDbConnectionSettings intranetDbConnectionSettings)
	{
		_intranetDbConnectionSettings = intranetDbConnectionSettings;
	}
	public async Task<IntranetProject[]> LoadProjectsAsync(CancellationToken cancellationToken)
	{
		var res = new List<IntranetProject>();

		var builder = new MySqlConnectionStringBuilder
		{
			Server = _intranetDbConnectionSettings.Host,
			Database = _intranetDbConnectionSettings.DbName,
			UserID = _intranetDbConnectionSettings.User,
			Password = _intranetDbConnectionSettings.Password,
			Port = _intranetDbConnectionSettings.Port,
			SslMode = MySqlSslMode.Disabled,
			AllowZeroDateTime = true,
			ConvertZeroDateTime = true
		};

		using var conn = new MySqlConnection(builder.ConnectionString);
		await conn.OpenAsync(cancellationToken);

		using var command = conn.CreateCommand();
		command.CommandText =
			"SELECT c.display_name, u2.name as gip_name, u2.email as gip_email, u.name as manager_name, u.email as manager_email, p.prj_project_ID, p.project_code, p.project_name, p.open, p.company_ID, p.date_from, p.date_to, p.date_to_fact, p.manager_ID, p.gip_ID, p.customer_ID, p.dogovor, p.internal FROM prj_reestr p  " +
			"left join jos_users u on u.id = p.manager_ID " +
			"left join jos_users u2 on u2.id = p.gip_ID " +
			"left join civicrm_contact c on c.id = p.customer_ID ";

		using var reader = await command.ExecuteReaderAsync(cancellationToken);
		while (await reader.ReadAsync(cancellationToken))
		{
			res.Add(new IntranetProject
			{
				Id = reader.GetInt32("prj_project_ID"),
				ShortName = reader.GetString("project_code"),
				Name = reader.GetString("project_name"),
				Opened = reader.GetInt32("open") == 1,
				DepartmentId = reader.GetInt32("company_ID"),
				Start = reader["date_from"] == DBNull.Value ? DateTime.Now : reader.GetDateTime("date_from"),
				End = reader["date_to"] == DBNull.Value ? new DateTime(2999, 01, 01) : reader.GetDateTime("date_to"),
				CloseDate = reader["date_to_fact"] == DBNull.Value ? null : reader.GetDateTime("date_to_fact"),
				ManagerId = reader["manager_ID"] == DBNull.Value ? null : reader.GetInt32("manager_ID"),
				LeadEngineerId = reader["gip_ID"] == DBNull.Value ? null : reader.GetInt32("gip_ID"),
				CustomerName = reader["display_name"] == DBNull.Value ? "---" : reader.GetString("display_name"),
				Contract = reader.GetString("dogovor"),
				Internal = reader.GetInt32("internal") == 1,
				ManagerEmail = reader["manager_email"] == DBNull.Value ? null : reader.GetString("manager_email"),
				LeadEngineerEmail = reader["gip_email"] == DBNull.Value ? null : reader.GetString("gip_email")

			});
		}

		return res.ToArray();
	}

	public async Task<IntranetUser[]> LoadUsersAsync(CancellationToken cancellationToken)
	{
		var res = new List<IntranetUser>();

		var builder = new MySqlConnectionStringBuilder
		{
			Server = _intranetDbConnectionSettings.Host,
			Database = _intranetDbConnectionSettings.DbName,
			UserID = _intranetDbConnectionSettings.User,
			Password = _intranetDbConnectionSettings.Password,
			Port = _intranetDbConnectionSettings.Port,
			SslMode = MySqlSslMode.Disabled,
			AllowZeroDateTime = true,
			ConvertZeroDateTime = true
		};

		using var conn = new MySqlConnection(builder.ConnectionString);
		await conn.OpenAsync(cancellationToken);

		using var command = conn.CreateCommand();
		var sql =
			"SELECT u.cb_workentry, u.cb_workfinish, (isnull(u.cb_workfinish) or (u.cb_workfinish = '0000-00-00') or (u.cb_workfinish > now())) as isEmployee, u.cb_effectiverate, u.user_id, p.Title, u.firstname, u.middlename, u.lastname, u2.email, u.cb_departament_fact FROM jos_comprofiler u " +
			"left join sms_position p on u.user_id = p.UserID and u.cb_departament = p.DepartmentID " +
			"left join jos_users u2 on u2.id = u.user_id ";

		command.CommandText = sql;

		var userIdx = 1;
		using var reader = await command.ExecuteReaderAsync(cancellationToken);
		while (await reader.ReadAsync(cancellationToken))
		{
			var userEmail = reader["email"] == DBNull.Value
				? $"no_email_{userIdx}@sms-a.ru"
				: reader.GetString("email");
			if (string.IsNullOrWhiteSpace(userEmail))
			{
				userEmail = $"no_email_{userIdx}@sms-a.ru";
			}

			// the rate is 1 when the DB doesn't have information about the rate
			var userRateAsStr = reader["cb_effectiverate"] == DBNull.Value
				? "1"
				: reader.GetString("cb_effectiverate").Replace(",", ".");

			if (string.IsNullOrWhiteSpace(userRateAsStr))
			{
				userRateAsStr = "1";
			}

			var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
			ci.NumberFormat.CurrencyDecimalSeparator = ".";
			if (!double.TryParse(userRateAsStr, NumberStyles.Any, ci, out double userRateAsFloat))
			{
				userRateAsFloat = 0;
			}

			var quitDate = reader.GetDateTime("cb_workfinish");
			var hiringdDate = reader.GetDateTime("cb_workentry");

			res.Add(new IntranetUser
			{
				Id = reader.GetInt32("user_id"),
				FirstName = reader.GetString("firstname"),
				MiddleName = reader["middlename"] == DBNull.Value ? string.Empty : reader.GetString("middlename"),
				LastName = reader.GetString("lastname"),
				Email = userEmail,
				DepartmentId = reader.GetInt32("cb_departament_fact"),
				Title = reader["Title"] == DBNull.Value ? string.Empty : reader.GetString("Title"),
				TimeRate = userRateAsFloat,
				QuitDate = quitDate == DateTime.MinValue ? null : quitDate,
				HiringDate = hiringdDate
			});

			userIdx++;
		}

		return res.ToArray();
	}

	public async Task<IntranetDepartment[]> LoadDepartmentsAsync(CancellationToken cancellationToken)
	{
		var res = new List<IntranetDepartment>();
		var builder = new MySqlConnectionStringBuilder
		{
			Server = _intranetDbConnectionSettings.Host,
			Database = _intranetDbConnectionSettings.DbName,
			UserID = _intranetDbConnectionSettings.User,
			Password = _intranetDbConnectionSettings.Password,
			Port = _intranetDbConnectionSettings.Port,
			SslMode = MySqlSslMode.Disabled,
			AllowZeroDateTime = true
		};

		using var conn = new MySqlConnection(builder.ConnectionString);
		await conn.OpenAsync(cancellationToken);

		using var command = conn.CreateCommand();
		command.CommandText = "SELECT name, prj_company_ID, parent, order_number, short_name FROM prj_company;";

		using var reader = await command.ExecuteReaderAsync(cancellationToken);
		while (await reader.ReadAsync(cancellationToken))
		{
			res.Add(new IntranetDepartment
			{
				Id = reader.GetInt32("prj_company_ID"),
				ParentId = reader["parent"] == DBNull.Value ? null : reader.GetInt32("parent"),
				Name = reader.GetString("name"),
				ShortName = reader.GetString("short_name"),
				OrderNumber = reader.GetInt32("order_number")
			});
		}

		return res.ToArray();
	}
	public async Task<CalendarDay[]> LoadCalendarAsync(CancellationToken cancellationToken)
	{
		var res = new List<CalendarDay>();

		var builder = new MySqlConnectionStringBuilder
		{
			Server = _intranetDbConnectionSettings.Host,
			Database = _intranetDbConnectionSettings.DbName,
			UserID = _intranetDbConnectionSettings.User,
			Password = _intranetDbConnectionSettings.Password,
			Port = _intranetDbConnectionSettings.Port,
			SslMode = MySqlSslMode.Disabled,
		};

		using var conn = new MySqlConnection(builder.ConnectionString);
		await conn.OpenAsync(cancellationToken);

		using var command = conn.CreateCommand();
		var sql =
			"SELECT distinct date, day_type_id as type FROM intranet.marks_calendar where day_type_id in (0, 1, 6) and employee_ID is null order by date desc";

		command.CommandText = sql;
		using var reader = await command.ExecuteReaderAsync(cancellationToken);
		while (await reader.ReadAsync(cancellationToken))
		{
			var dayTypeId = reader.GetInt32("type");
			var dayType = CalendarDayType.None;

			dayType = dayTypeId switch
			{
				1 => CalendarDayType.Holiday,
				6 => CalendarDayType.HalfHoliday,
				0 => CalendarDayType.WorkDay,
				_ => throw new Exception($"Cannot import non working day from an Intranet DB with type = {dayTypeId}"),
			};

			res.Add(new CalendarDay
			{
				Date = reader.GetDateTime("date"),
				DayType = dayType
			});
		}

		return res.ToArray();
	}

	public async Task<IntranetUserVacation[]> LoadVacationsAsync(CancellationToken cancellationToken)
	{
		var res = new List<IntranetUserVacation>();

		var builder = new MySqlConnectionStringBuilder
		{
			Server = _intranetDbConnectionSettings.Host,
			Database = _intranetDbConnectionSettings.DbName,
			UserID = _intranetDbConnectionSettings.User,
			Password = _intranetDbConnectionSettings.Password,
			Port = _intranetDbConnectionSettings.Port,
			SslMode = MySqlSslMode.Disabled,
		};

		using var conn = new MySqlConnection(builder.ConnectionString);
		await conn.OpenAsync(cancellationToken);

		using var command = conn.CreateCommand();
		var sql =
			"select u.email, e.date, e.day_type_ID " +
			"from marks_calendar e " +
			"join jos_users u on u.id = e.employee_ID " +
			"where u.email <> '' and e.employee_ID is not null and e.day_type_ID in (2, 7) " +
			"order by e.date";

		command.CommandText = sql;
		using var reader = await command.ExecuteReaderAsync(cancellationToken);
		while (await reader.ReadAsync(cancellationToken))
		{
			res.Add(new IntranetUserVacation
			{
				Email = reader.GetString("email"),
				Date = reader.GetDateTime("date"),
				IsMaternityLeave = reader.GetInt32("day_type_ID") == 7
			});
		}

		return res.ToArray();
	}
}