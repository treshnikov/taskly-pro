#!/bin/sh
cd ../src/Server/Taskly.WebApi
donet build
dotnet run

cd ..
cd ..
cd ..
cd Client
npm start