# Overview
Taskly is a pet project that was developed to cover the needs of project planning processes for my employer.

There are two main stages:
 - A "bird view" project plan that is used by the project managers to plan a large set of projects within 10-20 big tasks per project. Each project task has its description, time period, and estimations for each company's department.
- Department plan - contains the weekly plan of a certain department for each employee. The heads of departments have to keep their department plans updated according to the project's tasks (that were planned in the previous step by project managers), and the available working hours of department employees.

As a result, project managers and department heads get a tool that provides the following features:
- Planning project tasks, including work estimation for each department, qualification of employees, and available time ranges.
- Scheduling work by week for each department's employee.
- Showing all projects that contain work for the department.
- Visualizing project tasks according to their estimation and dates in the weekly plan.
- Highlighting weeks where a certain department cannot complete all scheduled tasks due to overload. 
- Comparing planned hours in project with a working plan of the department.
- Calculation of the load of the department and the required number of employees to perform the work on time.

![](https://github.com/treshnikov/taskly-pro/blob/main/img/Taskly.png)

## Technologies
* [ASP.NET Core 6](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-6.0), [Entity Framework Core 6](https://docs.microsoft.com/en-us/ef/core/).
* [MediatR](https://github.com/jbogard/MediatR), [AutoMapper](https://automapper.org/), [FluentValidation](https://fluentvalidation.net/), [Shouldly](https://github.com/shouldly/shouldly).
* [MUI](https://mui.com/), [Handsontable](https://handsontable.com/), [Chart.js](https://www.chartjs.org/).
* [React](https://reactjs.org/), [Redux Toolkit](https://redux-toolkit.js.org/), [React Router](https://reactrouter.com/), [i18next](https://react.i18next.com/).
* [JWT Authentication](https://jwt.io/), [WebAPi Versioning](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.Versioning/).

# Build and Run
## Debug mode
- Navigate to `src/Server/Taskly.WebApi` and run `dotnet build` and then `dotnet run`. The server will create a SQLite DB and populate it with demo data.
- Navigate to `src/Client` and run `npm i` and then `npm start` to build and run the client app.
- Default account is `admin@admin.com` with the password 'admin'.
 
## Production mode
- Run `scripts/publish-all.bat` for Windows or `scripts/publish-all.sh` for Linux / Mac.
- Navigate to `dist` directory and run `Taskly.WebApi.exe`.
