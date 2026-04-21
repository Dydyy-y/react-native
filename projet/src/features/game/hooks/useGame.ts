import { useCallback } from 'react';
import { useGameContext } from '../contexts/GameContext';
import * as gameService from '../services/gameService';
import { getErrorMessage } from '../../../shared/utils/errorHandler';
import { RoundAction, RoundActionsResponse } from '../types/game.types';

/**
 * Hook principal pour le jeu. Facade entre GameScreen et GameContext.
 * Encapsule les appels API (gameService) et les dispatch dans le reducer.
 * Les donnees retournees viennent du state, les actions font fetch + dispatch.
 */
export const useGame = () => {
  const { state, dispatch } = useGameContext();

  const setSessionId = useCallback(
    (id: number) => {
      dispatch({ type: 'SET_SESSION_ID', payload: id });
    },
    [dispatch],
  );

  const setPlayerNames = useCallback(
    (names: Record<number, string>) => {
      dispatch({ type: 'SET_PLAYER_NAMES', payload: names });
    },
    [dispatch],
  );

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

  const loadShipTypes = useCallback(async () => {
    try {
      const types = await gameService.getShipTypes();
      dispatch({ type: 'SET_SHIP_TYPES', payload: types });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
    }
  }, [dispatch]);

  const addAction = useCallback(
    (action: RoundAction) => {
      dispatch({ type: 'ADD_ACTION', payload: action });
    },
    [dispatch],
  );

  const removeAction = useCallback(
    (index: number) => {
      dispatch({ type: 'REMOVE_ACTION', payload: index });
    },
    [dispatch],
  );

  const clearActions = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIONS' });
  }, [dispatch]);

  // Envoie les actions au serveur. Si validees, vide la file et recharge
  // l'etat pour que round_actions_submitted passe a true (active le polling).
  const submitActions = useCallback(async (): Promise<RoundActionsResponse | null> => {
    if (!state.sessionId) return null;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const result = await gameService.submitActions(
        state.sessionId,
        state.pendingActions,
      );
      if (result.validated) {
        dispatch({ type: 'CLEAR_ACTIONS' });
        const newState = await gameService.getGameState(state.sessionId);
        dispatch({ type: 'SET_GAME_STATE', payload: newState });
      }
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, state.sessionId, state.pendingActions]);

  const clearGame = useCallback(() => {
    dispatch({ type: 'CLEAR_GAME' });
  }, [dispatch]);

  return {
    map: state.map,
    gameStatus: state.gameStatus,
    shipTypes: state.shipTypes,
    pendingActions: state.pendingActions,
    playerNames: state.playerNames,
    sessionId: state.sessionId,
    loading: state.loading,
    error: state.error,
    setSessionId,
    setPlayerNames,
    loadMap,
    loadState,
    loadShipTypes,
    addAction,
    removeAction,
    clearActions,
    submitActions,
    clearGame,
  };
};
