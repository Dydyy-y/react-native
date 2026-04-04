/** Joueur dans une session */
export interface Player {
  id: number;
  name: string;
}

/** Session de jeu retournée par l'API */
export interface GameSession {
  id: number;
  name: string;
  state: 'waiting' | 'running' | 'finished';
  invite_code: string;
  creator: Player;
  started_at: string;
  ended_at: string | null;
  players: Player[];
}

/** State du LobbyContext */
export interface LobbyState {
  currentSession: GameSession | null;
  loading: boolean;
  error: string | null;
}

/** Actions du reducer lobby */
export type LobbyAction =
  | { type: 'SET_SESSION'; payload: GameSession | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_SESSION' };
