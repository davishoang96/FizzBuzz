using FizzBuzz_Common;

namespace FizzBuzz_Services;

public interface IGameService
{
    int GetRandomNumber();
    Task<int> SaveOrUpdateGame(GameDTO gameDto);
    Task<int> DeleteGame(int gameId);
}