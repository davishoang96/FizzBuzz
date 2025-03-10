namespace FizzBuzz_Database;

public class Game : BaseModel
{
    public string Title { get; set; }
    public string Author { get; set; }
    public ICollection<Rule> Rules { get; set; } = new List<Rule>();
}