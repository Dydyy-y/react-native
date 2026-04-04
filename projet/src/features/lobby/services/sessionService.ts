import apiClient from '../../../shared/config/apiClient';
import { GameSession } from '../types/lobby.types';

/** Créer une session : POST /game-sessions */
export const createSession = async (name: string): Promise<GameSession> => {
  const response = await apiClient.post<GameSession>('/game-sessions', { name });
  return response.data;
};

/** Récupérer les infos d'une session : GET /game-sessions/{id} */
export const getSession = async (id: number): Promise<GameSession> => {
  const response = await apiClient.get<GameSession>(`/game-sessions/${id}`);
  return response.data;
};

/** Rejoindre une session via invite_code : POST /game-sessions/join */
export const joinSession = async (inviteCode: string): Promise<GameSession> => {
  const response = await apiClient.post<GameSession>('/game-sessions/join', {
    invite_code: inviteCode,
  });
  return response.data;
};

/** Quitter une session : POST /game-sessions/{id}/leave */
export const leaveSession = async (id: number): Promise<void> => {
  await apiClient.post(`/game-sessions/${id}/leave`);
};

/** Supprimer une session (créateur) : DELETE /game-sessions/{id} */
export const deleteSession = async (id: number): Promise<void> => {
  await apiClient.delete(`/game-sessions/${id}`);
};

/** Démarrer la partie (créateur) : POST /game-sessions/{id}/start */
export const startGame = async (id: number): Promise<void> => {
  await apiClient.post(`/game-sessions/${id}/start`);
};

/** Expulser un joueur (créateur) : POST /game-sessions/{id}/kick */
export const kickPlayer = async (sessionId: number, playerId: number): Promise<void> => {
  await apiClient.post(`/game-sessions/${sessionId}/kick`, { player_id: playerId });
};

/** Bannir un joueur (créateur) : POST /game-sessions/{id}/ban */
export const banPlayer = async (sessionId: number, playerId: number): Promise<void> => {
  await apiClient.post(`/game-sessions/${sessionId}/ban`, { player_id: playerId });
};
