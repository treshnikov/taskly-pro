# By default, the docker image runs the app with SQLite DB located in the container. 
# It's suitable for testing purposes but for production please use Docker volumes or 
# modify the app code in order to store data in PostgreSQL or other DB externally.

# Script snippets for building an image and launching a container
# docker build --progress=plain -t taskly-pro . 
# docker run -it --rm -p 6001:6001 --name taskly-pro taskly-pro

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install -y nodejs

# prepare publish directory 
WORKDIR /dist
RUN mkdir logs
RUN mkdir ClientApp

# build client
COPY src/Client /src/Client/
WORKDIR /src/Client
RUN npm i --verbose 
RUN npm run build -p --verbose
RUN cp -r /dist/ClientApp/build/. /dist/ClientApp

# build server
WORKDIR /src

# firstly copy and restore projects
COPY "src/Server/Taskly.Domain/Taskly.Domain.csproj" "src/Server/Taskly.Domain/Taskly.Domain.csproj"
COPY "src/Server/Taskly.Application/Taskly.Application.csproj" "src/Server/Taskly.Application/Taskly.Application.csproj"
COPY "src/Server/Taskly.DAL/Taskly.DAL.csproj" "src/Server/Taskly.DAL/Taskly.DAL.csproj"
COPY "src/Server/Taskly.WebApi/Taskly.WebApi.csproj" "src/Server/Taskly.WebApi/Taskly.WebApi.csproj"
RUN dotnet restore src/Server/Taskly.Domain/Taskly.Domain.csproj
RUN dotnet restore src/Server/Taskly.Application/Taskly.Application.csproj
RUN dotnet restore src/Server/Taskly.DAL/Taskly.DAL.csproj
RUN dotnet restore src/Server/Taskly.WebApi/Taskly.WebApi.csproj

# then copy other server files and build the server
COPY src/Server /src/Server
RUN dotnet publish "Server/Taskly.WebApi/Taskly.WebApi.csproj" -o ../../../dist -c Release --nologo

FROM mcr.microsoft.com/dotnet/aspnet:6.0
COPY --from=build /dist/ app/

ENV ASPNETCORE_URLS=""

WORKDIR /app
ENTRYPOINT ["dotnet", "Taskly.WebApi.dll"]