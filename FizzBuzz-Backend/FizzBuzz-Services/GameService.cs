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
        return random.Next(1, 1000);
    }

    public async Task<int> SaveOrUpdateGame(GameDTO gameDto)
    {
        // Create new game
        if (gameDto.Id == 0)
        {
            var newGame = new Game
            {
                Author = gameDto.Author,
                Title = gameDto.Title,
                Rules = gameDto.Rules.Select(r => new Rule { 
                    RuleName = r.RuleName, 
                    Number = r.Number 
                }).ToList()
            };
        
            await db.Games.AddAsync(newGame);
            return await db.SaveChangesAsync();
        }
    
        // Update existing game
        var game = await db.Games.Include(g => g.Rules)
                       .FirstOrDefaultAsync(g => g.Id == gameDto.Id)
                   ?? throw new InvalidOperationException($"Game with id {gameDto.Id} not found");

        // Update properties
        game.Author = gameDto.Author;
        game.Title = gameDto.Title;
    
        // Synchronize rules
        var result = SynchronizeRules(game, gameDto.Rules);
    
        game.Rules = result;
        
        return await db.SaveChangesAsync();
    }

    public async Task<int> DeleteGame(int gameId)
    {
        var game = await db.Games.Include(s=>s.Rules).FirstOrDefaultAsync(s=>s.Id == gameId)
                   ?? throw new InvalidOperationException($"Game with id {gameId} not found");
        
        db.Games.Remove(game);
        await db.SaveChangesAsync();
        
        return 0;
    }

    public async Task<IEnumerable<Game>> GetAllGames()
    {
        return db.Games.Include(g => g.Rules);
    }

    public async Task<Game> GetGameById(int gameId)
    {
        var game = await db.Games.Include(s=>s.Rules).FirstOrDefaultAsync(s=>s.Id == gameId)
                   ?? throw new InvalidOperationException($"Game with id {gameId} not found");
        
        return game;
    }

    private ICollection<Rule> SynchronizeRules(Game game, ICollection<RuleDTO> ruleDtos)
    {
        // Remove rules not in DTO
        foreach (var rule in game.Rules.ToList())
        {
            if (!ruleDtos.Any(r => r.Id == rule.Id && r.Id != 0))
            {
                db.Remove(rule);
            }
        }
    
        // Update or add rules
        foreach (var ruleDto in ruleDtos)
        {
            if (ruleDto.Id != 0)
            {
                // Update existing rule
                var rule = game.Rules.FirstOrDefault(r => r.Id == ruleDto.Id);
                if (rule != null)
                {
                    rule.RuleName = ruleDto.RuleName;
                    rule.Number = ruleDto.Number;
                }
            }
            else
            {
                // Add new rule
                game.Rules.Add(new Rule { 
                    RuleName = ruleDto.RuleName, 
                    Number = ruleDto.Number 
                });
            }
        }
        
        return game.Rules;
    }
}
