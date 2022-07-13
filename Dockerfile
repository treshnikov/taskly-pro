FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install -y nodejs

WORKDIR /src

COPY "src/Server/Taskly.Domain/Taskly.Domain.csproj" "src/Server/Taskly.Domain/Taskly.Domain.csproj"
COPY "src/Server/Taskly.Application/Taskly.Application.csproj" "src/Server/Taskly.Application/Taskly.Application.csproj"
COPY "src/Server/Taskly.DAL/Taskly.DAL.csproj" "src/Server/Taskly.DAL/Taskly.DAL.csproj"
COPY "src/Server/Taskly.WebApi/Taskly.WebApi.csproj" "src/Server/Taskly.WebApi/Taskly.WebApi.csproj"

RUN dotnet restore src/Server/Taskly.Domain/Taskly.Domain.csproj
RUN dotnet restore src/Server/Taskly.Application/Taskly.Application.csproj
RUN dotnet restore src/Server/Taskly.DAL/Taskly.DAL.csproj
RUN dotnet restore src/Server/Taskly.WebApi/Taskly.WebApi.csproj

COPY src/ /src/

RUN dotnet publish "Server/Taskly.WebApi/Taskly.WebApi.csproj" -o ../../../dist -c Release --nologo

WORKDIR /src/Client
RUN npm i --verbose 
RUN npm run build -p --verbose

WORKDIR /dist
RUN mkdir logs

FROM mcr.microsoft.com/dotnet/aspnet:6.0
COPY --from=build /dist/ app/

EXPOSE 5001

WORKDIR /app
ENTRYPOINT ["./Taskly.WebApi"]