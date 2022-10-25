using Taskly.DAL;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using System.Reflection;

namespace Taskly.WebApi
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine($"Taskly {ProductVersion}");
            var host = CreateHostBuilder(args).Build();
            var conf = host.Services.GetService<IConfiguration>();

            // logger
            var logDirectory = conf!["Logger:Directory"];
            var logFileName = System.IO.Path.Combine(logDirectory, "log-.log");
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .WriteTo.File(logFileName, rollingInterval: RollingInterval.Day)
                .WriteTo.Console(theme: SystemConsoleTheme.Literate)
                .CreateLogger();

            using (var scope = host.Services.CreateScope())
            {
                var serviceProvider = scope.ServiceProvider;
                try
                {
                    var context = serviceProvider.GetRequiredService<TasklyDbContext>();
                    DbInitializer.Initialize(context);
                }
                catch (Exception ex)
                {
                    Log.Fatal(ex, "An error occurred while app initialization.");
                }
            }

            host.Run();
        }

        public static string ProductVersion
        {
            get
            {
                var version = Assembly
                    .GetEntryAssembly()?
                    .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?
                    .InformationalVersion
                    .Replace("+", ".");

                if (version == null)
                {
                    return string.Empty;
                }

                return $"v{version}";
            }
        }

        private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}