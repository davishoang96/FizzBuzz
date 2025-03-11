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

// Game service with reusable API calls
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