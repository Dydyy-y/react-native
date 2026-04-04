import apiClient from '../../../shared/config/apiClient';
import { GameMap, GameStatus } from '../types/game.types';

/** Recuperer la carte : GET /game-sessions/{id}/map */
export const getGameMap = async (sessionId: number): Promise<GameMap> => {
  const response = await apiClient.get<GameMap>(
    `/game-sessions/${sessionId}/map`,
  );
  return response.data;
};

/** Recuperer l'etat courant : GET /game-sessions/{id}/state */
export const getGameState = async (sessionId: number): Promise<GameStatus> => {
  const response = await apiClient.get<GameStatus>(
    `/game-sessions/${sessionId}/state`,
  );
  return response.data;
};
