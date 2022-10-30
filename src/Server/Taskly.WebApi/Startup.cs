using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Taskly.Application;
using Taskly.Application.Common;
using Taskly.Application.Interfaces;
using Taskly.DAL;
using Taskly.WebApi.Middleware;
using Taskly.WebApi.Services;
using Swashbuckle.AspNetCore.SwaggerGen;
using Taskly.WebApi.Controllers;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using Taskly.WebApi.Common;
using Taskly.Application.Users;

namespace Taskly.WebApi;

public class Startup
{
	public IConfiguration Configuration { get; }

	public Startup(IConfiguration configuration) => Configuration = configuration;

	public void ConfigureServices(IServiceCollection services)
	{
		services.AddAutoMapper(config =>
		{
			config.AddProfile(new AssemblyMappingProfile(Assembly.GetEntryAssembly()!));
			config.AddProfile(new AssemblyMappingProfile(typeof(ITasklyDbContext).Assembly));
		});

		services.AddApplication();
		services.AddPersistence(config =>
		{
			config.DbConnectionString = Configuration["DbConnection"];
		});

		services.AddResponseCompression();

		services.AddControllers().AddJsonOptions(opt =>
		{
			opt.JsonSerializerOptions.Converters.Add(new DateTimeToNumberJsonConverter());
			opt.JsonSerializerOptions.Converters.Add(new DateTimeNullableToNumberJsonConverter());
		});

		// IntranetDb connection config
		services
			.AddOptions<IntranetDbConnectionSettings>()
			.BindConfiguration(nameof(IntranetDbConnectionSettings))
			.ValidateDataAnnotations()
			.ValidateOnStart();
		services.AddScoped(resolver => resolver.GetRequiredService<IOptions<IntranetDbConnectionSettings>>().Value);

		services.AddCors(options =>
		{
			options.AddPolicy("AllowAll", policy =>
			{
				policy.AllowAnyOrigin();
				policy.AllowAnyHeader();
				policy.AllowAnyMethod();
				policy.AllowAnyOrigin();
			});
		});

		services.AddSpaStaticFiles(configuration =>
		{
			configuration.RootPath = Configuration["SpaPath"] ?? "ClientApp";
			Log.Logger.Information($"SPA static files directory for Production mode is set to {configuration.RootPath}");
		});

		services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
				{
					// add an option that token can be extracted not only from "Authentication: Bearer ..." header but also from Request Cookies
					options.Events = new JwtBearerEvents
					{
						OnMessageReceived = context =>
						{
							context.Token = context.Request.Cookies[AuthenticationController.JwtCookiesKey];
							return Task.CompletedTask;
						}
					};

					options.RequireHttpsMetadata = false;
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuer = false,
						ValidateAudience = false,
						ValidateLifetime = true,
						IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration["JwtToken"])),
						ValidateIssuerSigningKey = true,
					};
				});

		services.AddVersionedApiExplorer(opttions =>
		{
			opttions.GroupNameFormat = "'v'VVV";
		});
		services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
		services.AddSwaggerGen();

		services.AddApiVersioning();
		services.AddSingleton<ICurrentUserService, CurrentUserService>();
		services.AddHttpContextAccessor();
	}

	public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
	{
		if (env.IsDevelopment())
		{
			app.UseDeveloperExceptionPage();
		}

		app.UseStaticFiles();
		if (!env.IsDevelopment())
		{
			Log.Logger.Information("Release mode is set. SPA static files will be used from the directory predefined above (see log messages below).");
			app.UseSpaStaticFiles();
		}

		app.UseSwagger();
		app.UseSwaggerUI(conf =>
		{
			foreach (var description in provider.ApiVersionDescriptions)
			{
				conf.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
			}
			conf.RoutePrefix = env.IsDevelopment() ? "" : "swagger";
		});
		app.UseCustomExceptionHandler();
		app.UseRouting();
		//app.UseHttpsRedirection();
		app.UseCors("AllowAll");

		app.UseAuthentication();
		app.UseAuthorization();
		app.UseApiVersioning();
		app.UseResponseCompression();
		app.UseEndpoints(endpoints =>
		{
			endpoints.MapControllers();
			endpoints.MapGraphQL();
			endpoints.MapGet("/version", () => Program.ProductVersion);

		});

		if (!env.IsDevelopment())
		{
			app.UseSpa(spa =>
					{
						spa.Options.SourcePath = Configuration["SpaPath"] ?? "ClientApp";
						Log.Logger.Information($"spa.Options.SourcePath = {spa.Options.SourcePath}");
					});
		}
	}
}