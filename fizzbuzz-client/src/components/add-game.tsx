import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gameService, GameDTO, RuleDTO } from '../services/gameServices';

const GameForm: React.FC = () => {
  const [game, setGame] = useState<GameDTO>({
    id: 0,
    title: '',
    author: '',
    rules: []
  });

  const [newRule, setNewRule] = useState<RuleDTO>({
    id: 0,
    ruleName: '',
    number: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGame({
      ...game,
      [name]: value
    });
  };

  const handleRuleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRule({
      ...newRule,
      [name]: name === 'number' ? parseInt(value) : value
    });
  };

  const addRule = () => {
    setGame({
      ...game,
      rules: [...game.rules, { ...newRule }]
    });
    setNewRule({
      id: 0,
      ruleName: '',
      number: game.rules.length + 1
    });
  };

  const removeRule = (index: number) => {
    const updatedRules = [...game.rules];
    updatedRules.splice(index, 1);
    setGame({
      ...game,
      rules: updatedRules
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await gameService.saveOrUpdateGame(game);
      if (response != null) {
        alert('Game saved successfully!');
        // Reset form or redirect
        setGame({
          id: 0,
          title: '',
          author: '',
          rules: []
        });
      }
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Failed to save game.');
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Add New Game</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={game.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="author" className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={game.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mt-4 mb-3">
              <h4 className="card-title">Game Rules</h4>
              
              {game.rules.length > 0 && (
                <div className="table-responsive mb-3">
                  <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '15%' }}>Number</th>
                        <th>Rule Name</th>
                        <th style={{ width: '15%' }} className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {game.rules.map((rule, index) => (
                        <tr key={index}>
                          <td>{rule.number}</td>
                          <td>{rule.ruleName}</td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => removeRule(index)}
                            >
                              <i className="bi bi-trash"></i> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="card bg-light">
                <div className="card-header">
                  <h5 className="mb-0">Add Rule</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-2">
                      <label htmlFor="ruleNumber" className="form-label">Number</label>
                      <input
                        type="number"
                        className="form-control"
                        id="ruleNumber"
                        name="number"
                        value={newRule.number}
                        onChange={handleRuleInputChange}
                        min="1"
                      />
                    </div>
                    <div className="col-md-10">
                      <label htmlFor="ruleName" className="form-label">Rule Name</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id="ruleName"
                          name="ruleName"
                          value={newRule.ruleName}
                          onChange={handleRuleInputChange}
                        />
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={addRule}
                          disabled={!newRule.ruleName}
                        >
                          <i className="bi bi-plus-circle me-1"></i> Add Rule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!game.title || !game.author}
              >
                <i className="bi bi-save me-1"></i> Save Game
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameForm;