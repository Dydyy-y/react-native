import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { GameState, GameAction } from '../types/game.types';

const initialState: GameState = {
  sessionId: null,
  map: null,
  gameStatus: null,
  shipTypes: [],
  pendingActions: [],
  playerNames: {},
  loading: false,
  error: null,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    case 'SET_PLAYER_NAMES':
      return { ...state, playerNames: action.payload };
    case 'SET_MAP':
      return { ...state, map: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, gameStatus: action.payload };
    case 'SET_SHIP_TYPES':
      return { ...state, shipTypes: action.payload };
    case 'ADD_ACTION':
      return { ...state, pendingActions: [...state.pendingActions, action.payload] };
    case 'REMOVE_ACTION':
      return {
        ...state,
        pendingActions: state.pendingActions.filter((_, i) => i !== action.payload),
      };
    case 'CLEAR_ACTIONS':
      return { ...state, pendingActions: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_GAME':
      return initialState;
    default:
      return state;
  }
};

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
};
