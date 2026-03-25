# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["EventZen.UserService.csproj", "./"]
RUN dotnet restore "./EventZen.UserService.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "EventZen.UserService.csproj" -c Release -o /app/build
RUN dotnet publish "EventZen.UserService.csproj" -c Release -o /app/publish

# Stage 2: Run the application
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "EventZen.UserService.dll"]
