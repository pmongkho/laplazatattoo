FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["LaPlazaTattoo.API.csproj", "./"]
RUN dotnet restore "LaPlazaTattoo.API.csproj"

COPY . .
RUN dotnet build "LaPlazaTattoo.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LaPlazaTattoo.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

# Install PostgreSQL client tools
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

# Configure CORS for Vercel
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "LaPlazaTattoo.API.dll"]
