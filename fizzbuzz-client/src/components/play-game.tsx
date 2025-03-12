import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gameService, GameDTO } from "../services/gameServices";

const PlayGame: React.FC = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState<GameDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentNumber, setNumber] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0); // Track score

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) return;
      setLoading(true);
      try {
        const fetchedGame = await gameService.getGameById(parseInt(gameId));
        setGame(fetchedGame);
        fetchNewNumber(); // Load initial random number
      } catch (err) {
        setError("Error fetching game details");
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  const fetchNewNumber = async () => {
    try {
      const newNumber = await gameService.getRandomNumber();
      setNumber(Number(newNumber));
    } catch (err) {
      setError("Error fetching new random number");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!game || currentNumber === null) return;

    const matchingRules = game.rules.filter(rule => currentNumber % rule.number === 0);
    const correctAnswers = matchingRules.map(rule => rule.ruleName).join("");

    if ((matchingRules.length > 0 && userAnswer.trim().toLowerCase() === correctAnswers.toLowerCase()) || 
        (matchingRules.length === 0 && userAnswer.trim() === "")) {
      setFeedback("✅ Correct!");
      setScore(prevScore => prevScore + 10);
    } else {
      setFeedback(`❌ Incorrect! The correct answer is: ${correctAnswers || "(empty)"}`);
    }

    setUserAnswer(""); // Reset input field
    fetchNewNumber();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!game) return <div>No game found</div>;

  return (
    <div className="container mt-5">
      <h2>{game.title}</h2>
      <p><strong>Author:</strong> {game.author}</p>

      <h4>Score: {score} 🏆</h4>
      <h4>Current number: {currentNumber}</h4>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="btn btn-primary mt-2">Submit</button>
      </form>

      {feedback && <p className="mt-3"><strong>{feedback}</strong></p>}

      <h4>Rules:</h4>
      <ul>
        {game.rules.map(rule => (
          <li key={rule.id}>
            <p>If number is divisible by <strong>{rule.number}</strong>, type <strong>{rule.ruleName}</strong></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayGame;
