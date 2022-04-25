# Taskly
The solution provides a CQRS-based project template that can be used for developing and supporting quite large projects. It uses the following technologies:
* [ASP.NET Core 6](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-6.0), [Entity Framework Core 6](https://docs.microsoft.com/en-us/ef/core/)
* [MediatR](https://github.com/jbogard/MediatR), [AutoMapper](https://automapper.org/), [FluentValidation](https://fluentvalidation.net/), [Shouldly](https://github.com/shouldly/shouldly)
* [React](https://reactjs.org/), [i18next](https://react.i18next.com/), [React Router](https://v5.reactrouter.com/web/guides/quick-start)
* [JWT Authentication](https://jwt.io/), [WebAPi Versioning](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.Versioning/)

## Build and Run
### Server
- The project has already contained predefined `tasks.json` and `launch.json` files for `vscode` which means you can build the project using `vscode` hotkeys.
- You also can build the server manually, For this navigate to `src/Server/Taskly.WebApi` directory and run `dotnet build` and `dotnet run`.
- To specify paths to DB and Log folders see `appsettings.json` file:
  - `DbConnection` - the project uses SQLite DB.
  - `Logger:Directory` - path to the log folder.
- The server will create SQLite DB and populate it with default data. For instance, default user with name and password `admin`.

### Client
- Navigate to `src/Client` directory and run `npm start`.

## Swagger / Postman
Use SwaggerUI or Postman and perform the following steps:
- Send a `/api/v1/auth/token` request to get the user token.
- You can use a default user `admin` with password `admin`. You also can create a new user, for this send `/api/v1/auth/register` request and pass `Name`, `Password`, and `Email` to register a new user.
- Pass the token to the request header `"Authentication": "Bearer %your-token%"` and send the request. For example, `/api/v1/auth/users`. 