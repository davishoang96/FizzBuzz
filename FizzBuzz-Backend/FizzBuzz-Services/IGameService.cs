using FizzBuzz_Common;
using FizzBuzz_Database;

namespace FizzBuzz_Services;

public interface IGameService
{
    int GetRandomNumber();
    Task<int> SaveOrUpdateGame(GameDTO gameDto);
    Task<int> DeleteGame(int gameId);
    Task<IEnumerable<Game>> GetAllGames();
    Task<Game> GetGameById(int gameId);
}