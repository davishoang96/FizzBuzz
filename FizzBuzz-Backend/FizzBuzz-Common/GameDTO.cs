namespace FizzBuzz_Common;

public class GameDTO
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public List<RuleDTO> Rules { get; set; } = new List<RuleDTO>();
}