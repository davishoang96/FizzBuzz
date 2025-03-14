using FizzBuzz_Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddTransient<GameContext>();
builder.Services.AddTransient<IGameService, GameService>();

// Get connection string from configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// Add DbContext
builder.Services.AddDbContext<GameContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy => policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowNextJs");

// Apply migration
using (var scope = ((IApplicationBuilder)app).ApplicationServices.GetService<IServiceScopeFactory>()!.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<GameContext>().Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();