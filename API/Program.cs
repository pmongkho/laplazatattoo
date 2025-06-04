using LaPlazaTattoo.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IConsultationService, ConsultationService>();
builder.Services.AddSingleton<IArtistService, ArtistService>();
builder.Services.AddSingleton<IDealService, DealService>();



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Changed from AddOpenApi()



var app = builder.Build();

// Enable Swagger in dev environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Changed from MapOpenApi()
    app.UseSwaggerUI(); // Added UseSwaggerUI()
}

app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();
app.Run();
