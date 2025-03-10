namespace FizzBuzz_Database;

public class Rule : BaseModel
{
    public string RuleName { get; set; }
    public int Number { get; set; }
    public int GameId { get; set; }
    public Game Game { get; set; }
}