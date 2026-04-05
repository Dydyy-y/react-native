import { useCallback } from 'react';
import { useGameContext } from '../contexts/GameContext';
import * as gameService from '../services/gameService';
import { getErrorMessage } from '../../../shared/utils/errorHandler';
import { RoundAction, RoundActionsResponse } from '../types/game.types';

/**
 * Hook principal pour le jeu.
 * Expose les donnees (map, gameStatus, shipTypes, pendingActions)
 * et les actions (loadMap, loadState, loadShipTypes, addAction, removeAction, submitActions).
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

  /** Charge les types de vaisseaux (une seule fois) */
  const loadShipTypes = useCallback(async () => {
    try {
      const types = await gameService.getShipTypes();
      dispatch({ type: 'SET_SHIP_TYPES', payload: types });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
    }
  }, [dispatch]);

  /** Ajoute une action au tour en cours */
  const addAction = useCallback(
    (action: RoundAction) => {
      dispatch({ type: 'ADD_ACTION', payload: action });
    },
    [dispatch],
  );

  /** Supprime une action par son index */
  const removeAction = useCallback(
    (index: number) => {
      dispatch({ type: 'REMOVE_ACTION', payload: index });
    },
    [dispatch],
  );

  /** Vide toutes les actions en attente */
  const clearActions = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIONS' });
  }, [dispatch]);

  /** Soumet les actions du tour au serveur */
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
        // Recharger l'etat pour refléter round_actions_submitted = true
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

  /** Nettoie l'etat du jeu */
  const clearGame = useCallback(() => {
    dispatch({ type: 'CLEAR_GAME' });
  }, [dispatch]);

  return {
    map: state.map,
    gameStatus: state.gameStatus,
    shipTypes: state.shipTypes,
    pendingActions: state.pendingActions,
    sessionId: state.sessionId,
    loading: state.loading,
    error: state.error,
    setSessionId,
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
