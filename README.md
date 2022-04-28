# Taskly
The solution provides a CQRS-based project template that can be used for developing and supporting large projects. 
The template uses the following technologies:
* [ASP.NET Core 6](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-6.0), [Entity Framework Core 6](https://docs.microsoft.com/en-us/ef/core/)
* [MediatR](https://github.com/jbogard/MediatR), [AutoMapper](https://automapper.org/), [FluentValidation](https://fluentvalidation.net/), [Shouldly](https://github.com/shouldly/shouldly)
* [React](https://reactjs.org/), [i18next](https://react.i18next.com/), [React Router](https://reactrouter.com/)
* [JWT Authentication](https://jwt.io/), [WebAPi Versioning](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.Versioning/)

## Build and Run
- The project has already contained predefined `tasks.json` and `launch.json` files for `vscode` which means you can build server and client projects using `vscode` tasks.
### Server
- You also can build the server manually. For this navigate to `src/Server/Taskly.WebApi` and run `dotnet build` and then `dotnet run`.
- Check `appsettings.json` file to specify settings:
  - `DbConnection` - path to the SQLite DB file.
  - `Logger:Directory` - path to the log folder.
  - `SpaPath` - path to Client app files. This path is used only in production mode.
- The server will create SQLite DB and populate it with default data. For instance, default user with name and password `admin`.

### Client
- Specify `proxy` key in `src/Client/package.json`. This key must refer to the server URI. Default value is `https://localhost:5000`.
- Navigate to `src/Client` and run `npm start`.
- In order to build the client for production usage run `npm build`. Files will be placed into the build folder. The server must link this folder via the `SpaPath` setting. 

## Swagger / Postman
Use SwaggerUI or Postman and perform the following steps:
- Register a new user `/api/v1/auth/register` or use default user with name password `admin`.
- Send a `/api/v1/auth/token` request to get the user token.
- Pass the token to the request header `"Authentication": "Bearer %your-token%"` for other requests. 