using FizzBuzz_Database;
using Microsoft.EntityFrameworkCore;

public class GameContext : DbContext
{
    public GameContext(DbContextOptions<GameContext> options) : base(options) { }

    public DbSet<Game> Users { get; set; } // Example table
}