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

	private static Task HandleExceptionAsync(Exception exception, HttpContext context)
	{
		var code = HttpStatusCode.InternalServerError;
		switch (exception)
		{
			case ValidationException:
				code = HttpStatusCode.BadRequest;
				break;
			case NotFoundException:
				code = HttpStatusCode.NotFound;
				break;
			case AlreadyExistsException:
				code = HttpStatusCode.Conflict;
				break;
			case ForbiddenException:
				code = HttpStatusCode.Forbidden;
				break;
		}

		string? result = JsonSerializer.Serialize(new { Error = exception.Message });
		context.Response.ContentType = "application/json";
		context.Response.StatusCode = (int)code;

		return context.Response.WriteAsync(result);
	}
}