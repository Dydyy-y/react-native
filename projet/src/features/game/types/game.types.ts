// ─── Types de la feature Game (Sprint 4) ────────────────────────────────

/** Noeud de ressource sur la carte */
export interface ResourceNode {
  x: number;
  y: number;
}

/** Carte du jeu (statique, un seul fetch) */
export interface GameMap {
  id: number;
  width: number;
  height: number;
  resource_nodes: ResourceNode[];
}

/** Vaisseau sur la carte */
export interface Ship {
  id: number;
  ship_type_id: number;
  x: number;
  y: number;
  health: number;
  player_id: number;
}

/** Stats cumulees du joueur */
export interface PlayerStats {
  ships_destroyed: number;
  resources_collected: number;
}

/** Etat courant de la partie (polled) */
export interface GameStatus {
  round: number;
  resources: { ore: number } | null;
  stats: PlayerStats | null;
  ships: Ship[];
  round_actions_submitted: boolean;
  status: 'running' | 'finished';
}

/** Type de vaisseau disponible a l'achat */
export interface ShipType {
  id: number;
  name: 'fighter' | 'miner';
  damage: number;
  attack_range: number;
  gathering_rate: number;
  base_health: number;
  speed: number;
  cost: number;
}

// ─── Actions de tour (envoyées au serveur) ────────────────────────────

/** Action unitaire d'un tour */
export type RoundAction =
  | { type: 'move'; ship_id: number; target_x: number; target_y: number }
  | { type: 'attack'; ship_id: number; target_x: number; target_y: number }
  | { type: 'recruit'; ship_type_id: number; target_x: number; target_y: number };

/** Erreur renvoyée par le serveur pour une action invalide */
export interface ActionError {
  index: number;
  type: string;
  message: string;
  code: string;
}

/** Réponse POST /game-sessions/{id}/round-actions */
export interface RoundActionsResponse {
  validated: boolean;
  errors: ActionError[];
}

// ─── State & Actions du GameContext ─────────────────────────────────────

export interface GameState {
  sessionId: number | null;
  map: GameMap | null;
  gameStatus: GameStatus | null;
  shipTypes: ShipType[];
  pendingActions: RoundAction[];
  loading: boolean;
  error: string | null;
}

export type GameAction =
  | { type: 'SET_SESSION_ID'; payload: number }
  | { type: 'SET_MAP'; payload: GameMap }
  | { type: 'SET_GAME_STATE'; payload: GameStatus }
  | { type: 'SET_SHIP_TYPES'; payload: ShipType[] }
  | { type: 'ADD_ACTION'; payload: RoundAction }
  | { type: 'REMOVE_ACTION'; payload: number }
  | { type: 'CLEAR_ACTIONS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_GAME' };
