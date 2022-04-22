using System.Net;
using System.Text.Json;
using FluentValidation;
using Taskly.Application.Common.Exceptions;

namespace Taskly.WebApi.Middleware;

public class CustomExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;

    public CustomExceptionHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception e)
        {
            await HandleExceptionAsync(e, context);
        }
    }

    private Task HandleExceptionAsync(Exception exception, HttpContext context)
    {
        var code = HttpStatusCode.InternalServerError;
        var result = string.Empty;
        
        switch (exception)
        {
            case ValidationException validationException:
                code = HttpStatusCode.BadRequest;
                result = JsonSerializer.Serialize(validationException.Errors);
                break;
            case NotFoundException:
                code = HttpStatusCode.NotFound;
                break;
        }
        
        if (result == string.Empty)
        {
            result = JsonSerializer.Serialize(new {errpr = exception.Message});
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int) code;
        
        return context.Response.WriteAsync(result);
    }
}