using System.Globalization;
using MySqlConnector;

namespace Taskly.Application.Users
{
    public static class IntranetReader
    {
        public static async Task<IntranetProject[]> LoadProjectsFromIntranetDbAsync(IntranetDbConnectionSettings intranetDbConnectionSettings, CancellationToken cancellationToken)
        {
            var res = new List<IntranetProject>();

            var builder = new MySqlConnectionStringBuilder
            {
                Server = intranetDbConnectionSettings.Host,
                Database = intranetDbConnectionSettings.DbName,
                UserID = intranetDbConnectionSettings.User,
                Password = intranetDbConnectionSettings.Password,
                Port = intranetDbConnectionSettings.Port,
                SslMode = MySqlSslMode.Disabled
            };

            using var conn = new MySqlConnection(builder.ConnectionString);
            await conn.OpenAsync(cancellationToken);

            using var command = conn.CreateCommand();
            command.CommandText =
                "SELECT c.display_name, u2.name as gip_name, u2.email as gip_email, u.name as manager_name, u.email as manager_email, p.prj_project_ID, p.project_code, p.project_name, p.open, p.company_ID, p.date_from, p.date_to, p.date_to_fact, p.manager_ID, p.gip_ID, p.customer_ID, p.dogovor, p.internal FROM prj_reestr p  " +
                "join jos_users u on u.id = p.manager_ID " +
                "join jos_users u2 on u2.id = p.gip_ID " +
                "join civicrm_contact c on c.id = p.customer_ID ";

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
                    Start = reader.GetDateTime("date_from"),
                    End = reader.GetDateTime("date_to"),
                    CloseDate = reader["date_to_fact"] == DBNull.Value ? null : reader.GetDateTime("date_to_fact"),
                    ManagerId = reader["manager_ID"] == DBNull.Value ? null : reader.GetInt32("manager_ID"),
                    LeadEngineerId = reader["gip_ID"] == DBNull.Value ? null : reader.GetInt32("gip_ID"),
                    CustomerName = reader.GetString("display_name"),
                    Contract = reader.GetString("dogovor"),
                    Internal = reader.GetInt32("internal") == 1,
                    ManagerEmail = reader["manager_email"] == DBNull.Value ? null : reader.GetString("manager_email"),
                    LeadEngineerEmail = reader["gip_email"] == DBNull.Value ? null : reader.GetString("gip_email")

                });
            }

            return res.ToArray();
        }

        public static async Task<IntranetUser[]> LoadUsersFromIntranetDbAsync(IntranetDbConnectionSettings intranetDbConnectionSettings, CancellationToken cancellationToken)
        {
            var res = new List<IntranetUser>();

            var builder = new MySqlConnectionStringBuilder
            {
                Server = intranetDbConnectionSettings.Host,
                Database = intranetDbConnectionSettings.DbName,
                UserID = intranetDbConnectionSettings.User,
                Password = intranetDbConnectionSettings.Password,
                Port = intranetDbConnectionSettings.Port,
                SslMode = MySqlSslMode.Disabled
            };

            using var conn = new MySqlConnection(builder.ConnectionString);
            await conn.OpenAsync(cancellationToken);

            using var command = conn.CreateCommand();
            var sql =
                "SELECT u.cb_effectiverate, u.user_id, p.Title, u.firstname, u.middlename, u.lastname, u2.email, u.cb_departament_fact FROM jos_comprofiler u " +
                "join sms_position p on u.user_id = p.UserID and u.cb_departament_fact = p.DepartmentID " +
                "join jos_users u2 on u2.id = u.user_id " +
                "where u2.email is not null and u2.email <> '' ";

            command.CommandText = sql;

            using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                var userRateAsStr = reader["cb_effectiverate"] == DBNull.Value
                    ? ""
                    : reader.GetString("cb_effectiverate").Replace(",", ".");

                var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
                ci.NumberFormat.CurrencyDecimalSeparator = ".";
                if (!double.TryParse(userRateAsStr, NumberStyles.Any, ci, out double userRateAsFloat))
                {
                    userRateAsFloat = 0;
                }

                res.Add(new IntranetUser
                {
                    Id = reader.GetInt32("user_id"),
                    FirstName = reader.GetString("firstname"),
                    MiddleName = reader.GetString("middlename"),
                    LastName = reader.GetString("lastname"),
                    Email = reader.GetString("email"),
                    DepartmentId = reader.GetInt32("cb_departament_fact"),
                    Title = reader.GetString("Title"),
                    TimeRate = userRateAsFloat
                });
            }

            return res.ToArray();
        }

        public static async Task<IntranetDepartment[]> LoadDepartmentsFromIntranetDbAsync(IntranetDbConnectionSettings intranetDbConnectionSettings, CancellationToken cancellationToken)
        {
            var res = new List<IntranetDepartment>();
            var builder = new MySqlConnectionStringBuilder
            {
                Server = intranetDbConnectionSettings.Host,
                Database = intranetDbConnectionSettings.DbName,
                UserID = intranetDbConnectionSettings.User,
                Password = intranetDbConnectionSettings.Password,
                Port = intranetDbConnectionSettings.Port,
                SslMode = MySqlSslMode.Disabled
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

    }
}