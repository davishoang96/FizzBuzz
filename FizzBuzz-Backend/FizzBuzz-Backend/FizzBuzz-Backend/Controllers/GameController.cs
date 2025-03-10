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
    
}