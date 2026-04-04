import apiClient from '../../../shared/config/apiClient';
import {
  GameMap,
  GameStatus,
  ShipType,
  RoundAction,
  RoundActionsResponse,
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

/** Recuperer les types de vaisseaux : GET /ship-types */
export const getShipTypes = async (): Promise<ShipType[]> => {
  const response = await apiClient.get<{ shipTypes: ShipType[] }>('/ship-types');
  return response.data.shipTypes;
};
