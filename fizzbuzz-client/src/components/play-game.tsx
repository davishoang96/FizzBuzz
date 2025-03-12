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
  
  // Timer related states
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30 seconds timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) return;
      setLoading(true);
      try {
        const fetchedGame = await gameService.getGameById(parseInt(gameId));
        setGame(fetchedGame);
        fetchNewNumber(); // Load initial random number
        setIsTimerRunning(true); // Start the timer when game loads
      } catch (err) {
        setError("Error fetching game details");
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && !isGameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer as NodeJS.Timeout);
            setIsTimerRunning(false);
            setIsGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, isGameOver, timeLeft]);

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
    if (!game || currentNumber === null || isGameOver) return;

    const matchingRules = game.rules.filter(rule => currentNumber % rule.number === 0);
    const correctAnswers = matchingRules.map(rule => rule.ruleName).join("");

    if ((matchingRules.length > 0 && userAnswer.trim().toLowerCase() === correctAnswers.toLowerCase()) || 
        (matchingRules.length === 0 && userAnswer.trim() === currentNumber.toString())) {
      setFeedback("✅ Correct!");
      setScore(prevScore => prevScore + 10);
      // Add a small time bonus for correct answers
      setTimeLeft(prevTime => Math.min(prevTime + 2, 30));
    } else {
      setFeedback(`❌ Incorrect! The correct answer is: ${correctAnswers || currentNumber}`);
      // Deduct time for incorrect answers
      setTimeLeft(prevTime => Math.max(prevTime - 5, 0));
    }

    setUserAnswer(""); // Reset input field
    fetchNewNumber();
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsTimerRunning(true);
    setFeedback(null);
    fetchNewNumber();
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!game) return <div className="alert alert-warning">No game found</div>;

  // Calculate percentage for progress bar
  const timerPercentage = (timeLeft / 30) * 100;

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">{game.title}</h2>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>Author:</strong> {game.author}</p>
            </div>
            <div className="col-md-6 text-md-end">
              <h4>Score: <span className="badge bg-success">{score} 🏆</span></h4>
            </div>
          </div>

          {/* Timer */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Time Left:</span>
              <span className={`badge ${timeLeft < 10 ? 'bg-danger' : 'bg-info'}`}>{timeLeft} seconds</span>
            </div>
            <div className="progress" style={{ height: '20px' }}>
              <div 
                className={`progress-bar ${
                  timeLeft > 20 ? 'bg-success' : 
                  timeLeft > 10 ? 'bg-warning' : 'bg-danger'
                }`} 
                role="progressbar" 
                style={{ width: `${timerPercentage}%` }}
                aria-valuenow={timerPercentage} 
                aria-valuemin={0} 
                aria-valuemax={100}
              ></div>
            </div>
          </div>

          {isGameOver ? (
            <div className="text-center my-5">
              <h3>Game Over!</h3>
              <p className="lead">Your final score: <strong>{score}</strong></p>
              <button 
                className="btn btn-primary btn-lg mt-3" 
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          ) : (
            <>
              <div className="card mb-4 bg-light">
                <div className="card-body text-center">
                  <h3>Current number: <span className="badge bg-secondary">{currentNumber}</span></h3>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isGameOver}
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isGameOver}
                  >
                    Submit
                  </button>
                </div>
              </form>

              {feedback && (
                <div className={`alert ${feedback.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
                  <strong>{feedback}</strong>
                </div>
              )}
            </>
          )}

          <div className="card mt-4">
            <div className="card-header">
              <h4 className="mb-0">Rules:</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {game.rules.map(rule => (
                  <li key={rule.id} className="list-group-item">
                    <p className="mb-0">If number is divisible by <strong>{rule.number}</strong>, type <strong>{rule.ruleName}</strong></p>
                  </li>
                ))}
                <li className="list-group-item">
                  <p className="mb-0">If no rules apply, type the number itself</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card-footer text-muted">
          <div className="d-flex justify-content-between align-items-center">
            <button 
              className="btn btn-outline-secondary" 
              onClick={resetGame}
            >
              Reset Game
            </button>
            <span>Time Bonus: +2s for correct answers | -5s for incorrect answers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayGame;