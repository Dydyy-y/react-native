import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LobbyState, LobbyAction } from '../types/lobby.types';

const initialState: LobbyState = {
  currentSession: null,
  loading: false,
  error: null,
};

const lobbyReducer = (state: LobbyState, action: LobbyAction): LobbyState => {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, currentSession: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_SESSION':
      return { ...initialState };
    default:
      return state;
  }
};

interface LobbyContextType {
  state: LobbyState;
  dispatch: React.Dispatch<LobbyAction>;
}

const LobbyContext = createContext<LobbyContextType | null>(null);

export const LobbyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(lobbyReducer, initialState);

  return (
    <LobbyContext.Provider value={{ state, dispatch }}>
      {children}
    </LobbyContext.Provider>
  );
};

export const useLobbyContext = (): LobbyContextType => {
  const ctx = useContext(LobbyContext);
  if (!ctx) throw new Error('useLobbyContext must be used within LobbyProvider');
  return ctx;
};
