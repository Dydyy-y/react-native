import { useCallback } from 'react';
import { useLobbyContext } from '../contexts/LobbyContext';
import * as sessionService from '../services/sessionService';
import { getErrorMessage } from '../../../shared/utils/errorHandler';
import { AxiosError } from 'axios';

/**
 * Hook pour les actions de moderation reservees au createur de la session.
 * Chaque action appelle l'API puis rafraichit la session localement.
 * Si la session a ete supprimee entre-temps (404), on nettoie le state.
 */
export const useModeration = () => {
  const { state, dispatch } = useLobbyContext();

  // Gere le 404/403 si la session a ete supprimee entre-temps
  const safeRefreshSession = useCallback(async (sessionId: number) => {
    try {
      const updated = await sessionService.getSession(sessionId);
      dispatch({ type: 'SET_SESSION', payload: updated });
    } catch (error) {
      if (error instanceof AxiosError && (error.response?.status === 404 || error.response?.status === 403)) {
        dispatch({ type: 'CLEAR_SESSION' });
      }
    }
  }, [dispatch]);

  const kickPlayer = useCallback(async (playerId: number) => {
    if (!state.currentSession) return { success: false as const, error: 'Aucune session' };
    try {
      await sessionService.kickPlayer(state.currentSession.id, playerId);
      await safeRefreshSession(state.currentSession.id);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, error: getErrorMessage(error) };
    }
  }, [dispatch, state.currentSession, safeRefreshSession]);

  const banPlayer = useCallback(async (playerId: number) => {
    if (!state.currentSession) return { success: false as const, error: 'Aucune session' };
    try {
      await sessionService.banPlayer(state.currentSession.id, playerId);
      await safeRefreshSession(state.currentSession.id);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, error: getErrorMessage(error) };
    }
  }, [dispatch, state.currentSession, safeRefreshSession]);

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

  const startGame = useCallback(async () => {
    if (!state.currentSession) return { success: false as const, error: 'Aucune session' };
    try {
      await sessionService.startGame(state.currentSession.id);
      await safeRefreshSession(state.currentSession.id);
      return { success: true as const };
    } catch (error) {
      return { success: false as const, error: getErrorMessage(error) };
    }
  }, [dispatch, state.currentSession, safeRefreshSession]);

  return { kickPlayer, banPlayer, deleteSession, startGame };
};
