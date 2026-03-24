# Architecture - Space Conquest Online (Zustand + Feature-Folder)

**Date** : 24 mars 2026  
**Version** : 2.0 - Zustand Edition  
**Status** : Prête pour implémentation

---

## 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│         React Native + Expo + TypeScript                │
│              + Zustand (State Management)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┬──────────────┬─────────────┐           │
│  │   Auth      │   Lobby      │   Game      │  Écrans  │
│  │  Screens    │   Screens    │   Screens   │           │
│  └─────────────┴──────────────┴─────────────┘           │
│           ↓           ↓            ↓                     │
│  ┌────────────────────────────────────────┐             │
│  │       Navigation Stack + Tabs          │             │
│  │  (React Navigation)                    │             │
│  └────────────────────────────────────────┘             │
│           ↓                                              │
│  ┌────────────────────────────────────────┐             │
│  │   4 Zustand Stores (Simple & Fast)     │             │
│  │  ├─ authStore   (user, token)          │             │
│  │  ├─ lobbyStore  (sessions, players)    │             │
│  │  ├─ gameStore   (map, state, ships)    │             │
│  │  └─ uiStore     (toasts, modals)       │             │
│  └────────────────────────────────────────┘             │
│           ↓                                              │
│  ┌────────────────────────────────────────┐             │
│  │   Feature Services (API calls)         │             │
│  │  ├─ authService                        │             │
│  │  ├─ sessionService                     │             │
│  │  ├─ gameService                        │             │
│  │  └─ qrService                          │             │
│  └────────────────────────────────────────┘             │
│           ↓                                              │
│  ┌────────────────────────────────────────┐             │
│  │   Shared Hooks (useApi, usePolling)    │             │
│  └────────────────────────────────────────┘             │
│           ↓                                              │
│  ┌────────────────────────────────────────┐             │
│  │   API Client (Axios + Interceptors)    │             │
│  │   Base URL: https://space-conquest...  │             │
│  └────────────────────────────────────────┘             │
│
└─────────────────────────────────────────────────────────┘
```

---

## 2. Structure du Projet (Feature-Folder Layout)

```
my-app/
├── src/
│   │
│   ├── features/                    ← DOSSIERS PAR FEATURE
│   │   │
│   │   ├── auth/                    ← Feature 1: Authentification
│   │   │   ├── store/
│   │   │   │   └── authStore.ts     (30 lignes Zustand)
│   │   │   ├── services/
│   │   │   │   ├── authService.ts
│   │   │   │   └── tokenStorage.ts
│   │   │   ├── screens/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── SignUpScreen.tsx
│   │   │   │   └── SplashScreen.tsx
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts       (Wrapper optionnel du store)
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts             (Export public)
│   │   │
│   │   ├── lobby/                   ← Feature 2: Salon d'attente
│   │   │   ├── store/
│   │   │   │   └── lobbyStore.ts
│   │   │   ├── services/
│   │   │   │   ├── sessionService.ts
│   │   │   │   └── lobbyService.ts
│   │   │   ├── screens/
│   │   │   │   ├── LobbyListScreen.tsx
│   │   │   │   ├── JoinSessionScreen.tsx
│   │   │   │   ├── CreateSessionScreen.tsx
│   │   │   │   └── SessionDetailScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── PlayerList.tsx
│   │   │   │   ├── QRDisplay.tsx
│   │   │   │   └── QRScanner.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useLobby.ts
│   │   │   ├── types/
│   │   │   │   └── lobby.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── game/                    ← Feature 3: Le jeu
│   │   │   ├── store/
│   │   │   │   └── gameStore.ts
│   │   │   ├── services/
│   │   │   │   ├── gameService.ts
│   │   │   │   └── mapService.ts
│   │   │   ├── screens/
│   │   │   │   ├── GameScreen.tsx
│   │   │   │   ├── MapScreen.tsx
│   │   │   │   └── GameStateScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── GameMap.tsx
│   │   │   │   ├── MapCell.tsx
│   │   │   │   ├── ShipIcon.tsx
│   │   │   │   └── PlayerStats.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useGame.ts
│   │   │   ├── types/
│   │   │   │   └── game.types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── ui/                      ← Feature 4: UI state + components globaux
│   │       ├── store/
│   │       │   └── uiStore.ts       (Toasts, modals, alerts)
│   │       ├── components/
│   │       │   ├── Button.tsx
│   │       │   ├── Input.tsx
│   │       │   ├── Card.tsx
│   │       │   ├── Toast.tsx
│   │       │   └── Modal.tsx
│   │       ├── hooks/
│   │       │   ├── useToast.ts
│   │       │   └── useModal.ts
│   │       └── index.ts
│   │
│   ├── shared/                      ← Partagé entre toutes les features
│   │   ├── components/
│   │   │   └── [Composants ultra-communs]
│   │   ├── hooks/
│   │   │   ├── useApi.ts            (Generic API hook avec retry logic)
│   │   │   └── usePolling.ts        (Generic polling hook)
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── validation.ts
│   │   │   ├── formatter.ts
│   │   │   ├── logger.ts
│   │   │   └── errorHandler.ts
│   │   ├── types/
│   │   │   └── common.types.ts
│   │   └── config/
│   │       ├── apiClient.ts         (Axios instance avec interceptors)
│   │       └── appConfig.ts
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx        (Auth → App conditional)
│   │   └── NavigationTypes.ts
│   │
│   ├── App.tsx                      (Entry point)
│   └── index.ts
│
├── assets/
├── package.json
├── tsconfig.json
├── app.json
├── .env.example
└── .gitignore
```

---

## 3. Gestion d'État avec Zustand

### 3.1 Architecture Zustand

**Principe** : Un store par domaine métier, actions génériques incluent tout.

```typescript
// Exemple minimal : authStore.ts
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // State
  user: null,
  token: null,
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, token: null }),
}));
```

### 3.2 Les 4 Stores Principaux

#### AuthStore
```typescript
interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (bool: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}
```

#### LobbyStore
```typescript
interface LobbyState {
  currentSession: GameSession | null
  sessions: GameSession[]
  players: Player[]
  loading: boolean
  error: string | null
  
  setCurrentSession: (session: GameSession | null) => void
  setSessions: (sessions: GameSession[]) => void
  setPlayers: (players: Player[]) => void
  updatePlayer: (player: Player) => void
  addPlayer: (player: Player) => void
  removePlayer: (playerId: string) => void
}
```

#### GameStore
```typescript
interface GameState {
  gameId: string | null
  map: GameMap | null
  gameState: GameState | null
  ships: Ship[]
  players: Player[]
  loading: boolean
  error: string | null
  
  setGameId: (id: string | null) => void
  setMap: (map: GameMap) => void
  setGameState: (state: GameState) => void
  updateShips: (ships: Ship[]) => void
}
```

#### UIStore
```typescript
interface UIState {
  toasts: Toast[]
  modals: Modal[]
  
  addToast: (toast: Toast) => void
  removeToast: (id: string) => void
  showModal: (modal: Modal) => void
  hideModal: (id: string) => void
}
```

---

## 4. Data Flow

### Authentication Flow
```
LoginScreen (input)
  ↓
useAuth() hook
  ↓
authService.login()
  ↓
API call (axios)
  ↓
authStore.setUser() + setToken()
  ↓
RootNavigator (conditionally shows AppTabs)
```

### Lobby Flow
```
LobbyListScreen
  ↓
useLobby() hook
  ↓
sessionService.getSessions()
  ↓
API call
  ↓
lobbyStore.setSessions()
  ↓
UI re-renders with sessions list
```

### Polling Flow
```
SessionDetailScreen (mounted)
  ↓
usePolling() hook (interval = 30s)
  ↓
sessionService.getLobbyState()
  ↓
API call
  ↓
lobbyStore.setPlayers() + setCurrentSession()
  ↓
UI auto-updates players list
```

---

## 5. Services API

### Structure
```
services/
├── auth/
│   ├── authService.ts        → login(), register(), logout()
│   └── tokenStorage.ts       → getToken(), setToken(), clearToken()
├── game/
│   ├── sessionService.ts     → create(), join(), leave(), kick(), ban(), delete(), start()
│   ├── gameService.ts        → getMap(), getState(), submitActions()
│   └── pollingService.ts     → Polling logic avec intervals
└── qr/
    └── qrService.ts          → generate(), scan()
```

### Exemple: authService.ts
```typescript
import axios from 'axios';

const API_BASE = 'https://space-conquest-online.osc-fr1.scalingo.io/api';

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    email,
    password,
  });
  return response.data; // { user, token }
};

export const register = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/auth/register`, {
    email,
    password,
  });
  return response.data; // { user, token }
};
```

---

## 6. Hooks

### Feature Hooks
```typescript
// features/auth/hooks/useAuth.ts
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  
  return { user, token, loading, error };
};
```

### Shared Hooks
```typescript
// shared/hooks/useApi.ts
export const useApi = async (
  cb: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) => {
  // Handle API calls with error handling & loading states
};

// shared/hooks/usePolling.ts
export const usePolling = (
  cb: () => Promise<void>,
  interval: number = 30000
) => {
  // Handle periodic API calls
};
```

---

## 7. Avantages de cette Architecture

✅ **Zero boilerplate** : Zustand stores = 30-50 lignes chacun  
✅ **No Provider Hell** : Pas de wrapping contexts en App.tsx  
✅ **Performance** : Selecteurs granulaires = re-renders optimisés  
✅ **Clear separation** : Features isolées = facile à travailler  
✅ **Testable** : Stores purs et faciles à tester  
✅ **Scalable** : Structure Feature-Folder = facile d'ajouter des features  

---

## 8. Bonnes Pratiques

### ✅ DO
- Créer un store par feature majeure (auth, lobby, game)
- Utiliser selecteurs granulaires : `useStore((state) => state.user)`
- Mettre la logique métier dans les services, pas dans les stores
- Importer les hooks depuis les `features/*/index.ts`

### ❌ DON'T
- Créer un mega-store avec tout dedans
- Mettre la logique API directement dans les composants
- Importer directement depuis `features/*/store/` (utiliser index.ts)
- Faire des imports croisés entre features (sauf via shared/)

---

## 9. Installation & Setup

```bash
# Install dependencies
npm install zustand axios expo-secure-store
npm install @react-navigation/native @react-navigation/bottom-tabs

# Create folder structure
mkdir -p src/features/{auth,lobby,game,ui}/{store,services,screens,components,hooks,types}
mkdir -p src/shared/{components,hooks,utils,types,config}
mkdir -p src/navigation
```

---

## 10. Prochaines Étapes

1. ✅ **ARCHITECTURE.md** (vous êtes ici)
2. → **IMPLEMENTATION_QUICKSTART.md** (pour commencer le coding)
3. → **PRD_EPIC1_AUTH.md** (specs détaillées)
4. → Coder Épic 1, puis Épic 2, 3, 4

---

**Status** : ✅ Prête pour implémentation Zustand  
**Date** : 24 mars 2026
