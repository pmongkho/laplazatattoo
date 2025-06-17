using LaPlazaTattoo.API.Services;
using Npgsql; // Make sure to include this if needed for specific Npgsql configurations
using LaPlazaTattoo.API.Data; // Add this using directive if not present
using Microsoft.EntityFrameworkCore; // Ensure this is present
using Npgsql.EntityFrameworkCore.PostgreSQL; // Add this using directive for UseNpgsql
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models; // Added missing using directive for OpenAPI types

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var blobConnectionString = builder.Configuration["AzureStorage:ConnectionString"]; // Removed duplicate declaration

// Configure the DbContext to use PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
  options.UseNpgsql(connectionString)); // Use AppDbContext and UseNpgsql

// Add this code before building the app
// JWT Authentication Configuration
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ??
          "YourSuperSecretKeyHereThatShouldBeAtLeast32BytesLong"))
  };
});

builder.Services.AddScoped<IConsultationService, ConsultationService>();
builder.Services.AddScoped<IArtistService, ArtistService>();
builder.Services.AddSingleton<IDealService, DealService>();
builder.Services.AddScoped<IFileStorageService, AzureBlobStorageService>();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
  options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    In = ParameterLocation.Header,
    Description = "Please enter token",
    Name = "Authorization",
    Type = SecuritySchemeType.ApiKey
  });

  options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
          { new OpenApiSecurityScheme
              {
                  Reference = new OpenApiReference
                  {
                      Type = ReferenceType.SecurityScheme,
                      Id = "Bearer"
                  }
              }, new string[] { }
          }
    });
}); // Changed from AddOpenApi()

var app = builder.Build();

// Enable Swagger in dev environment
if (app.Environment.IsDevelopment())
{
  app.UseSwagger(); // Changed from MapOpenApi()
  app.UseSwaggerUI(); // Added UseSwaggerUI()
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
