# Overview
Taskly is a pet project that was developed to cover the needs of project planning processes.

The system covers two stages of planning:
- In the first step you add a list of projects. Each project contains a set of tasks. Every task has a time range and estimation. Estimation can be added for each department as a list of records - [Employee position; Hours]. As a result, we have a time-bound project plan mapped to the company's departments with estimated hours. Usually, this plan is prepared by project managers as a rough estimation.
- In the second step you can run planning by week for every department. The system provides UI for each department that allows assigning planned working hours for a particular week and for a specific project task for a certain employee. As a result, we have a working plan for each employee in the given department.
- And last but not least, we can combine planned and fact hours for analytics. Out of the box, the system provides reports that show available department hours grouped by weeks and planned project tasks that should be done in a certain time period. Also a weekly overview form is provided to display working plans for each department/employee. This form is useful for an overview of the weekly plan during meetings.

Features:
- Handling users, departments, projects, tasks, task estimations, and holidays.
- Planning project tasks, including work estimation for each department and employee qualifications.
- Scheduling work by week for each employee in a certain department.
- Visualizing all projects that contain tasks for the given department.
- Highlighting weeks where a certain department cannot complete all scheduled tasks due to overload.
- Comparing planned hours in a project with a working plan of the department.
- Calculation the load of the department and the required number of employees to perform the work on time.

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
