import apiClient from '../../../shared/config/apiClient';
import {
  GameMap,
  GameStatus,
  ShipType,
  RoundAction,
  RoundActionsResponse,
  GameStats,
  GameHistoryResponse,
} from '../types/game.types';

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

/** Soumettre les actions du tour : POST /game-sessions/{id}/round-actions */
export const submitActions = async (
  sessionId: number,
  actions: RoundAction[],
): Promise<RoundActionsResponse> => {
  const response = await apiClient.post<RoundActionsResponse>(
    `/game-sessions/${sessionId}/round-actions`,
    { actions },
  );
  return response.data;
};

/** Recuperer les stats de fin de partie : GET /game-sessions/{id}/stats */
export const getGameStats = async (sessionId: number): Promise<GameStats> => {
  const response = await apiClient.get<GameStats>(
    `/game-sessions/${sessionId}/stats`,
  );
  return response.data;
};

/** Recuperer l'historique des parties : GET /game-sessions/history */
export const getGameHistory = async (page = 1): Promise<GameHistoryResponse> => {
  const response = await apiClient.get<GameHistoryResponse>(
    '/game-sessions/history',
    { params: { page } },
  );
  return response.data;
};

/** Recuperer les types de vaisseaux : GET /ship-types */
export const getShipTypes = async (): Promise<ShipType[]> => {
  const response = await apiClient.get('/ship-types');
  // L'API peut retourner { shipTypes: [...] } ou directement un tableau
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data?.shipTypes && Array.isArray(data.shipTypes)) return data.shipTypes;
  return [];
};
