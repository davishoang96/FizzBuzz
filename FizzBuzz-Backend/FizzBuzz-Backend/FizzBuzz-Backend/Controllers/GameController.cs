using FizzBuzz_Common;
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