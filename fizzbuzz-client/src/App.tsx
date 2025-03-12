import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import GameForm from './components/add-game';
import GetAllGames from './components/get-all-games';
import PlayGame from "./components/play-game";

const Home = () => (
  <div className="container py-2 text-center">
    <GetAllGames /> 
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">FizzBuzz Games</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/add-game">Add Game</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-game" element={<GameForm />} />
        <Route path="/play-game/:gameId" element={<PlayGame />} /> {/* Dynamic route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;