using FizzBuzz_Database;
using FizzBuzz_Database.Configurations;
using Microsoft.EntityFrameworkCore;

public class GameContext : DbContext
{
    public GameContext(DbContextOptions<GameContext> options) : base(options) { }

    public DbSet<Game> Games { get; set; }
    public DbSet<Rule> Rules { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new GameConfig());
        modelBuilder.ApplyConfiguration(new RuleConfig());
    }
}

