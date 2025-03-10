using System.Globalization;
using FizzBuzz_Common;
using FizzBuzz_Database;
using FizzBuzz_Services;
using Microsoft.AspNetCore.Mvc;

namespace FizzBuzz_Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GameController : ControllerBase
{
    private IGameService _gameService;
    public GameController(IGameService gameService)
    {
        _gameService = gameService; 
    }

    [HttpGet(Name = "GetAllGames")]
    public async Task<ActionResult<IEnumerable<GameDTO>>> GetAllGames()
    {
        var games = await _gameService.GetAllGames();
        var dtos = games.Select(game => new GameDTO
        {
            Id = game.Id,
            Author = game.Author,
            Title = game.Title,
            Rules = game.Rules.Select(s => new RuleDTO
            {
                Id = s.Id,
                RuleName = s.RuleName,
                Number = s.Number
            }).ToList() // Ensure List conversion
        }).ToList();
        return Ok(dtos);
    }
    
    [HttpGet(Name = "GetGameById")]
    public async Task<ActionResult<GameDTO>> GetGameById([FromQuery] int id)
    {
        try
        {
            var game = await _gameService.GetGameById(id);
            var dto = new GameDTO
            {
                Id = game.Id,
                Author = game.Author,
                Title = game.Title,
                Rules = new List<RuleDTO>()
            };

            foreach (var rule in game.Rules)
            {
                dto.Rules.Add(new RuleDTO
                {
                    Id = rule.Id,
                    Number = rule.Number,
                    RuleName = rule.RuleName,
                });
            }

            return Ok(dto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [HttpGet(Name = "GetRandomNumber")]
    public async Task<ActionResult<int>> GetRandomNumber()
    {
        return Ok(_gameService.GetRandomNumber());
    }

    [HttpDelete(Name = "DeleteGame")]
    public async Task<ActionResult> DeleteGame([FromQuery] int gameId)
    {
        var res = await _gameService.DeleteGame(gameId);
        if (res == 0)
        {
            return Ok();
        }
        else
        {
            return BadRequest();
        }
    }

    [HttpPost(Name = "SaveOrUpdateGame")]
    public async Task<ActionResult<int>> SaveOrUpdateGame([FromBody] GameDTO dto)
    {
        var res = await _gameService.SaveOrUpdateGame(dto);
        if (res > 0)
        {
            return Ok(res);
        }
        else
        {
            return BadRequest();
        }
    }
}