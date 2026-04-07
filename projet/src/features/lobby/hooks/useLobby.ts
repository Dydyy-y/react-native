import { useCallback } from 'react';
import { useLobbyContext } from '../contexts/LobbyContext';
import * as sessionService from '../services/sessionService';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

/**
 * Hook de récupération API pour le lobby.
 * Encapsule tous les appels API session + dispatch dans LobbyContext.
 */
export const useLobby = () => {
  const { state, dispatch } = useLobbyContext();

  /** Créer une session */
  const createSession = useCallback(async (name: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const session = await sessionService.createSession(name);
      dispatch({ type: 'SET_SESSION', payload: session });
      return { success: true as const };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false as const, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  /** Rejoindre une session via invite_code */
  const joinSession = useCallback(async (inviteCode: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const session = await sessionService.joinSession(inviteCode);
      dispatch({ type: 'SET_SESSION', payload: session });
      return { success: true as const };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false as const, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  /** Quitter la session courante */
  const leaveSession = useCallback(async () => {
    if (!state.currentSession) return { success: false as const, error: 'Aucune session' };
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await sessionService.leaveSession(state.currentSession.id);
      dispatch({ type: 'CLEAR_SESSION' });
      return { success: true as const };
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false as const, error: message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, state.currentSession]);

  /** Rafraîchir les données de la session (pour le polling) */
  const refreshSession = useCallback(async () => {
    if (!state.currentSession) return;
    try {
      const session = await sessionService.getSession(state.currentSession.id);
      dispatch({ type: 'SET_SESSION', payload: session });
    } catch (error) {
      // Erreurs gerees par le consommateur (SessionDetailScreen) via le throw
      throw error;
    }
  }, [dispatch, state.currentSession]);

  return {
    session: state.currentSession,
    loading: state.loading,
    error: state.error,
    createSession,
    joinSession,
    leaveSession,
    refreshSession,
    dispatch,
  };
};
