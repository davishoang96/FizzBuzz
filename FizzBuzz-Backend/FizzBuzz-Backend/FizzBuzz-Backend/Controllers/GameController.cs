using Microsoft.AspNetCore.Mvc;
namespace FizzBuzz_Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GameController : ControllerBase
{
    public GameController()
    {
        
    }

    [HttpGet(Name = "GetRandomNumber")]
    public async Task<ActionResult<int>> GetRandomNumber()
    {
        var random = new Random();
        return Ok(random.Next(1, 100));
    }
    
}