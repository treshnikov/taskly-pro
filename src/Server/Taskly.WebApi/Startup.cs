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
using Taskly.Application.Jwt;

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
                policy.AllowAnyOrigin();
                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
                policy.AllowAnyOrigin();
            });
        });

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
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