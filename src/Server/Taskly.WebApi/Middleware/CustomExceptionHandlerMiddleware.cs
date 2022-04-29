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
                break;
            case NotFoundException notFoundException:
                code = HttpStatusCode.NotFound;
                break;
            case AlreadyExistsException alreadyExistsException:
                code = HttpStatusCode.Conflict;
                break;
            case ForbiddenException forbiddenException:
                code = HttpStatusCode.Forbidden;
                break;
        }

        result = JsonSerializer.Serialize(new { Error = exception.Message });

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        return context.Response.WriteAsync(result);
    }
}