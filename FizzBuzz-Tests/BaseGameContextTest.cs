using Microsoft.EntityFrameworkCore;

namespace FizzBuzz_Tests;

public class BaseGameContextTest : IDisposable
{
    private readonly GameContext _context;
    internal readonly DbContextOptions<GameContext> options;
    
    public BaseGameContextTest()
    {
        options = new DbContextOptionsBuilder<GameContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        _context = new GameContext(options);
    }
    
    public void Dispose()
    {
        _context.Dispose();
    }
}