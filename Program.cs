using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Ajoute le support des Contrôleurs
builder.Services.AddControllers();

// 2. Configure la base de données SQLite (un fichier nommé shop.db va se créer)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=shop.db"));

// 3. Configuration du CORS pour React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseCors("AllowReactApp");

// Assigne les routes des contrôleurs
app.MapControllers();

app.Run();