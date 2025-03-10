using FizzBuzz_Common;
using FizzBuzz_Services;
using Microsoft.EntityFrameworkCore;

namespace FizzBuzz_Tests;

public class GameRepositoryTest : BaseGameContextTest
{
    private GameService _gameService;
    public GameRepositoryTest()
    {
        _gameService = new GameService(new GameContext(options));
    }
    
    [Fact]
    public async Task SaveOrUpdateGameOK()
    {
        // Arrange
        var dto = new GameDTO
        {
            Author = "Davis",
            Title = "FizzBuzzBoss",
            Rules = new List<RuleDTO>
            {
                new RuleDTO()
                {
                    Number = 5,
                    RuleName = "Fizz",
                },
                new RuleDTO()
                {
                    Number = 7,
                    RuleName = "Buzz",
                }
            }
        };

        // Act
        var result = await _gameService.SaveOrUpdateGame(dto);
        
        // Assert
        Assert.True(result != 0);
        
        using (var context = new GameContext(options))
        {
            var newGame = context.Games.Include((s=>s.Rules)).First();
            Assert.NotNull(newGame);
            Assert.Equal(dto.Author, newGame.Author);
            Assert.Equal(dto.Title, newGame.Title);
            Assert.NotEmpty(newGame.Rules);
            Assert.Equal(dto.Rules.First().Number, newGame.Rules.First().Number);
            Assert.Equal(dto.Rules.Last().Number, newGame.Rules.Last().Number);
        }
    }
}