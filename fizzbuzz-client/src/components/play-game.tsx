import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gameService, GameDTO } from "../services/gameServices";

const PlayGame: React.FC = () => {
  const { gameId } = useParams(); // Get gameId from URL
  const [game, setGame] = useState<GameDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentNumber, setNumber] = useState<number | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) return; // Ensure gameId exists
      setLoading(true);
      try {
        
        const fetchedGame = await gameService.getGameById(parseInt(gameId));
        setGame(fetchedGame);

        const randomNumber = await gameService.getRandomNumber();
        setNumber(Number(randomNumber));

      } catch (err) {
        setError("Error fetching game details");
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!game) return <div>No game found</div>;

  return (
    <div className="container mt-5">
      <h2>{game.title}</h2>
      <p><strong>Author:</strong> {game.author}</p>
      
      <h4>Current number: {currentNumber} </h4>
      <input type="text"
                  className="form-control"
                  placeholder="Enter your answer"
                  id="answer"
                  name="answer"
                  required />
      <br />
      <button className="btn btn-primary mt-2">Submit</button>

      <h4>Rules:</h4>
      <ul>
        {game.rules.map((rule) => (
          <li key={rule.id}>
            <p>If number is divisble by <strong>{rule.number}</strong>, type <strong>{rule.ruleName}</strong></p> 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayGame;
