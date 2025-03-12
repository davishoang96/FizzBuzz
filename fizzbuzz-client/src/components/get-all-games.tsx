import React, { useEffect, useState } from 'react';
import { gameService, GameDTO, RuleDTO } from '../services/gameServices'; // Import the gameService
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from "react-router-dom"; // Import useNavigate

const GamesPage: React.FC = () => {
  const [games, setGames] = useState<GameDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const allGames = await gameService.getAllGames();
        setGames(allGames);
      } catch (err) {
        setError('Error fetching games');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const deleteGame = async (gameId: number) => {
    try {
      await gameService.deleteGame(gameId);  // Call the delete API
      // Remove the deleted game from the state
      setGames(games.filter(game => game.id !== gameId));
    } catch (err) {
      console.error('Error deleting game:', err);
      setError('Error deleting the game');
    }
  };

  if (loading) return <div className="text-center"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      {games.length === 0 ? (
        <p>No games available</p>
      ) : (
        <div className="row">
          {games.map((game) => (
            <div key={game.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{game.title}</h5>
                  <p className="card-text text-muted">Author: {game.author}</p>
                  {/* <h6>Rules:</h6>
                  <ul>
                    {game.rules.map((rule) => (
                      <li key={rule.id}>
                        {rule.ruleName} - <strong>{rule.number}</strong>
                      </li>
                    ))}
                  </ul> */}
                  <button className="btn btn-secondary">Edit</button>
                  <button className="btn btn-danger" onClick={() => deleteGame(game.id)}>
                    Delete
                  </button>
                  <button className="btn btn-primary" onClick={() => navigate(`/play-game/${game.id}`)}>
                    Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesPage;
