# Overview
The solution provides a CQRS-based project template that can be used for developing and supporting large projects. 
The template uses the following technologies:
* [ASP.NET Core 6](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-6.0), [Entity Framework Core 6](https://docs.microsoft.com/en-us/ef/core/)
* [MediatR](https://github.com/jbogard/MediatR), [AutoMapper](https://automapper.org/), [FluentValidation](https://fluentvalidation.net/), [Shouldly](https://github.com/shouldly/shouldly)
* [React](https://reactjs.org/), [i18next](https://react.i18next.com/), [React Router](https://reactrouter.com/)
* [JWT Authentication](https://jwt.io/), [WebAPi Versioning](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.Versioning/)

# Build and Run
## Debug mode
- Navigate to `src/Server/Taskly.WebApi` and run `dotnet build` and then `dotnet run`.
  - The server will create a SQLite DB and populate it with default data if the DB was not created previously.
  - Default user name and password `admin`.
- Navigate to `src/Client` and run `npm i` and then `npm start`.
 
## Production mode
- Run `scripts/publish-all.bat` for Windows or `scripts\publish-all.sh` for Linux / Mac
- Navigate to `dist` directory and run `Taskly.WebApi.exe`

## Visual Studio Code tasks 
- The project contains predefined `tasks.json` and `launch.json` files. See them to build and run client and server both in Debug and PRelease modes. 

# Settings
## Server
Server stores its settings in `appsettings.json` file:
  - `DbConnection` - path to the SQLite DB file.
  - `Logger:Directory` - path to the log folder.
  - `SpaPath` - path to Client app files. This path is used only in production mode.

## Client
- In the development mode specify the `proxy` key in `src/Client/package.json`. This key must refer to the server URI. The default value is `https://localhost:5000`.

# Using Swagger / Postman
For testing purposes, you can use SwaggerUI or Postman.
By default, the API documentation is available at the address `https://localhost:5000/swagger/index.html`.
Follow the next steps to perform requests:
- Register a new user `/api/v1/auth/register` or use default user with name password `admin`.
- Send a `/api/v1/auth/token` request to get the user token.
- Pass the token to the request header `"Authentication": "Bearer %your-token%"` for other requests.
- Send other requests using this token.