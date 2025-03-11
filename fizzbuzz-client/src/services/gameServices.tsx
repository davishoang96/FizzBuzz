import axios from 'axios';

// Define types
export interface RuleDTO {
  id: number;
  ruleName: string;
  number: number;
}

export interface GameDTO {
  id: number;
  title: string;
  author: string;
  rules: RuleDTO[];
}

// API base URL
const API_BASE_URL = 'https://localhost:7285/api/Game';

export const gameService = {
  saveOrUpdateGame: async (game: GameDTO): Promise<number> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/SaveOrUpdateGame`, game);
      return response.data;
    } catch (error) {
      console.error('Error saving game:', error);
      throw error;
    }
  },

  deleteGame: async (id: number): Promise<boolean> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/DeleteGame`, {
        params: { gameId: id },
      });
  
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting game with ID ${id}:`, error);
      return false;
    }
  },
  
  
  getGameById: async (id: number): Promise<GameDTO> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetGameById/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching game with ID ${id}:`, error);
      throw error;
    }
  },

  getRandomNumber: async (): Promise<Number> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetRandomNumber`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all games:', error);
      throw error;
    }
  },
  
  getAllGames: async (): Promise<GameDTO[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetAllGames`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all games:', error);
      throw error;
    }
  }
};