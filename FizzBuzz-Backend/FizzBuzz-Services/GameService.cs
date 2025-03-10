using FizzBuzz_Common;
using FizzBuzz_Database;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzz_Services;

public class GameService : IGameService
{
    private readonly GameContext db;
    public GameService(GameContext dbContext)
    {
        db = dbContext;
    }
    
    public int GetRandomNumber()
    {
        var random = new Random();
        return random.Next(1, 100);
    }

    public async Task<int> SaveOrUpdateGame(GameDTO gameDto)
    {
        Game model = gameDto.Id == 0 ? new Game() : await db.Games.Include(g => g.Rules).FirstOrDefaultAsync(g => g.Id == gameDto.Id);

        if (model == null)
        {
            throw new InvalidOperationException($"Cannot find game model with id = {gameDto.Id}");
        }

        model.Author = gameDto.Author;
        model.Title = gameDto.Title;
        model.Rules ??= new List<Rule>();

        if (gameDto.Id == 0)
        {
            foreach (var r in gameDto.Rules)
            {
                model.Rules.Add(new Rule { RuleName = r.RuleName, Number = r.Number });
            }
            await db.Games.AddAsync(model);
        }
    
        return await db.SaveChangesAsync();
    }
}
