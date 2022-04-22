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
        services.AddPersistence(Configuration);
        services.AddControllers();
            
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
                policy.AllowAnyOrigin();
            });
        });

        // services.AddAuthentication(config =>
        // {
        //     config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        //     config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        // }).AddJwtBearer("Bearer", options =>
        // {
        //     options.Authority = "https://localhost:7097";
        //     options.Audience = "NotesWebAPI";
        //     options.RequireHttpsMetadata = false;
        // });

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
            //app.UseSwagger();
            //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "TodoApi v1"));
        }

        app.UseSwagger();
        app.UseSwaggerUI(conf =>
        {
            foreach (var description in provider.ApiVersionDescriptions)
            {
                conf.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
            }
            conf.RoutePrefix = String.Empty;
            conf.SwaggerEndpoint("swagger/v1/swagger.json", "NotesAPI");
        });
        app.UseCustomExceptionHandler();
        app.UseRouting();
        app.UseHttpsRedirection();
        app.UseCors("AllowAll");

        app.UseAuthentication();
        app.UseAuthorization();
        app.UseApiVersioning();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}