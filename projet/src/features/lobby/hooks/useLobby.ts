import { useCallback, useRef } from 'react';
import { useLobbyContext } from '../contexts/LobbyContext';
import * as sessionService from '../services/sessionService';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

/**
 * Hook facade pour le lobby. Encapsule les appels API (sessionService)
 * et les dispatch dans LobbyContext. Chaque action retourne { success, error? }
 * pour que l'ecran puisse afficher un toast adapte.
 */
export const useLobby = () => {
  const { state, dispatch } = useLobbyContext();

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

  // Ref stable pour l'ID de session : evite de recreer refreshSession
  // a chaque changement de session (ce qui relancerait le polling)
  const sessionIdRef = useRef(state.currentSession?.id);
  sessionIdRef.current = state.currentSession?.id;

  const refreshSession = useCallback(async () => {
    const id = sessionIdRef.current;
    if (!id) return;
    try {
      const session = await sessionService.getSession(id);
      dispatch({ type: 'SET_SESSION', payload: session });
    } catch (error) {
        throw error;
    }
  }, [dispatch]);

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
