using AutoFixture;
using FizzBuzz_Common;
using FizzBuzz_Database;
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
    public async Task GetAllGameTest()
    {
        // Arrange
        var fixture = new Fixture();
        var games = fixture.Build<Game>()
            .Without(s=>s.Id)
            .Without(s=>s.Rules)
            .CreateMany(10);
        
        using (var context = new GameContext(options))
        {
            context.AddRange(games);
            await context.SaveChangesAsync();
        }
        
        // Act
        var result = await _gameService.GetAllGames();
        
        // Assert
        Assert.Equal(games.Count(), result.Count());
    }
    
    [Fact]
    public async Task DeleteGameOk()
    {
        using (var context = new GameContext(options))
        {
            context.Games.Add(new Game
            {
                Id = 1,
                Title = "FizzBuzzBozz",
                Author = "Davis",
                Rules = new List<Rule>
                {
                    new Rule
                    {
                        Id = 1,
                        GameId = 1,
                        Number = 5,
                        RuleName = "Fizz"
                    }
                }
            });

            await context.SaveChangesAsync();
        }
        
        // Act
        var result = await _gameService.DeleteGame(1);
        
        // Assert
        Assert.Equal(0, result);
        using (var context = new GameContext(options))
        {
            Assert.Empty(context.Games);
            Assert.Empty(context.Rules);
        }
    }
    

    [Fact]
    public async Task UpdateGameOk()
    {
        // Arrange
        using (var context = new GameContext(options))
        {
            context.Games.Add(new Game
            {
                Id = 1,
                Title = "FizzBuzzBozz",
                Author = "Davis",
                Rules = new List<Rule>
                {
                    new Rule
                    {
                        Id = 1,
                        GameId = 1,
                        Number = 5,
                        RuleName = "Fizz"
                    }
                }
            });

            await context.SaveChangesAsync();
        }
        
        var dto = new GameDTO
        {
            Id = 1,
            Author = "Jimmy Hg",
            Title = "GiggityGiggityGoo",
            Rules = new List<RuleDTO>
            {
                new RuleDTO()
                {
                    Number = 9,
                    RuleName = "Goo",
                },
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
            Assert.True(dto.Rules.Count() == 1);
            Assert.Equal(dto.Rules.First().Number, newGame.Rules.First().Number);
        }
    }
    
    [Fact]
    public async Task SaveGameOk()
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