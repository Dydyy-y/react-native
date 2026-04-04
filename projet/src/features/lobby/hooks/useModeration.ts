import { useCallback } from 'react';
import { useLobbyContext } from '../contexts/LobbyContext';
import * as sessionService from '../services/sessionService';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

/**
 * Hook pour les actions de moderation du createur.
 * Kick, ban, delete session, start game.
 */
export const useModeration = () => {
  const { state, dispatch } = useLobbyContext();

  /** Expulser un joueur (kick) */
  const kickPlayer = useCallback(async (playerId: number) => {
    if (!state.currentSession) return { success: false as const, error: 'Aucune session' };
    try {
      await sessionService.kickPlayer(state.currentSession.id, playerId);
      // Rafraichir la session pour mettre a jour la liste des joueurs
      const updated = await sessionService.getSession(state.currentSession.id);
      dispatch({ type: 'SET_SESSION', payload: updated });
      return { success: true as const };
    } catch (error) {
      return { success: false as const, error: getErrorMessage(error) };
    }
  }, [dispatch, state.currentSession]);

  /** Bannir un joueur (ban) */
  const banPlayer = useCallback(async (playerId: number) => {
    if (!state.currentSession) return { success: false as const, error: 'Aucune session' };
    try {
      await sessionService.banPlayer(state.currentSession.id, playerId);
      const updated = await sessionService.getSession(state.currentSession.id);
      dispatch({ type: 'SET_SESSION', payload: updated });
      return { success: true as const };
    } catch (error) {
      return { success: false as const, error: getErrorMessage(error) };
    }
  }, [dispatch, state.currentSession]);

  /** Supprimer la session */
  const deleteSession = useCallback(async () => {
    if (!state.currentSession) return { success: false as const, error: 'Aucune session' };
    try {
      await sessionService.deleteSession(state.currentSession.id);
      dispatch({ type: 'CLEAR_SESSION' });
      return { success: true as const };
    } catch (error) {
      return { success: false as const, error: getErrorMessage(error) };
    }
  }, [dispatch, state.currentSession]);

  /** Demarrer la partie */
  const startGame = useCallback(async () => {
    if (!state.currentSession) return { success: false as const, error: 'Aucune session' };
    try {
      await sessionService.startGame(state.currentSession.id);
      // Rafraichir pour obtenir le state "running"
      const updated = await sessionService.getSession(state.currentSession.id);
      dispatch({ type: 'SET_SESSION', payload: updated });
      return { success: true as const };
    } catch (error) {
      return { success: false as const, error: getErrorMessage(error) };
    }
  }, [dispatch, state.currentSession]);

  return { kickPlayer, banPlayer, deleteSession, startGame };
};
