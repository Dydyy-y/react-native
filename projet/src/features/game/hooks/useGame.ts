import { useCallback } from 'react';
import { useGameContext } from '../contexts/GameContext';
import * as gameService from '../services/gameService';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

/**
 * Hook principal pour le jeu.
 * Expose les donnees (map, gameStatus) et les actions (loadMap, loadState, initGame).
 */
export const useGame = () => {
  const { state, dispatch } = useGameContext();

  /** Initialise la session de jeu dans le context */
  const setSessionId = useCallback(
    (id: number) => {
      dispatch({ type: 'SET_SESSION_ID', payload: id });
    },
    [dispatch],
  );

  /** Charge la carte (une seule fois au montage) */
  const loadMap = useCallback(async () => {
    if (!state.sessionId) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const map = await gameService.getGameMap(state.sessionId);
      dispatch({ type: 'SET_MAP', payload: map });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, state.sessionId]);

  /** Charge l'etat de la partie (appel initial + polling) */
  const loadState = useCallback(async () => {
    if (!state.sessionId) return;
    try {
      const gameStatus = await gameService.getGameState(state.sessionId);
      dispatch({ type: 'SET_GAME_STATE', payload: gameStatus });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
    }
  }, [dispatch, state.sessionId]);

  /** Initialise le jeu complet (carte + etat) */
  const initGame = useCallback(
    async (sessionId: number) => {
      dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
    },
    [dispatch],
  );

  /** Nettoie l'etat du jeu */
  const clearGame = useCallback(() => {
    dispatch({ type: 'CLEAR_GAME' });
  }, [dispatch]);

  return {
    map: state.map,
    gameStatus: state.gameStatus,
    sessionId: state.sessionId,
    loading: state.loading,
    error: state.error,
    setSessionId,
    loadMap,
    loadState,
    initGame,
    clearGame,
  };
};
