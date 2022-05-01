#!/usr/bin
rm -rf "../dist"

cd ../src/Server/Taskly.WebApi
dotnet publish -o ../../../dist -c Release --nologo

cd ../../Client
npm i --verbose && npm run build -p --verbose
