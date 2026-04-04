# Architecture - Space Conquest Online

**Date** : 24 mars 2026
**Version** : 3.0 - Context API Edition
**Status** : Prête pour implémentation

---

## 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│         React Native + Expo + TypeScript                │
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
│  │   4 Contexts + useReducer              │             │
│  │  ├─ AuthContext   (user, token)        │             │
│  │  ├─ LobbyContext  (sessions, players)  │             │
│  │  ├─ GameContext   (map, state, ships)  │             │
│  │  └─ UIContext     (toasts, modals)     │             │
│  └────────────────────────────────────────┘             │
│           ↓                                              │
│  ┌────────────────────────────────────────┐             │
│  │   Feature Services (API calls)         │             │
│  │  ├─ authService                        │             │
│  │  ├─ sessionService                     │             │
│  │  └─ gameService                        │             │
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
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Structure du Projet (Feature-Folder Layout)

```
src/
├── features/                    ← DOSSIERS PAR FEATURE
│   │
│   ├── auth/                    ← Feature 1: Authentification
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  (Context + Reducer + Provider + useAuth)
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   └── tokenStorage.ts
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   ├── SplashScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   ├── styles/
│   │   │   └── authStyles.ts   (Styles partagés Login/SignUp)
│   │   ├── hooks/
│   │   │   ├── useLogin.ts      (Hook récupération API login)
│   │   │   └── useRegister.ts   (Hook récupération API register)
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts             (Export public)
│   │
│   ├── lobby/                   ← Feature 2: Salon d'attente
│   │   ├── contexts/
│   │   │   └── LobbyContext.tsx
│   │   ├── services/
│   │   │   └── sessionService.ts
│   │   ├── screens/
│   │   │   ├── LobbyHomeScreen.tsx
│   │   │   ├── CreateSessionScreen.tsx
│   │   │   ├── JoinSessionScreen.tsx
│   │   │   └── SessionDetailScreen.tsx
│   │   ├── components/
│   │   │   ├── PlayerList.tsx
│   │   │   ├── QRDisplay.tsx
│   │   │   └── QRScanner.tsx
│   │   ├── hooks/
│   │   │   └── useLobby.ts
│   │   ├── types/
│   │   │   └── lobby.types.ts
│   │   └── index.ts
│   │
│   ├── game/                    ← Feature 3: Le jeu
│   │   ├── contexts/
│   │   │   └── GameContext.tsx
│   │   ├── services/
│   │   │   └── gameService.ts
│   │   ├── screens/
│   │   │   ├── GameScreen.tsx
│   │   │   └── GameOverScreen.tsx
│   │   ├── components/
│   │   │   ├── GameMap.tsx
│   │   │   ├── MapCell.tsx
│   │   │   ├── ShipInfo.tsx
│   │   │   └── PlayerStats.tsx
│   │   ├── hooks/
│   │   │   └── useGame.ts
│   │   ├── types/
│   │   │   └── game.types.ts
│   │   └── index.ts
│   │
│   └── ui/                      ← Feature 4: UI state + composants globaux
│       ├── contexts/
│       │   └── UIContext.tsx    (Context + Reducer + Provider + useUI + showToast)
│       ├── components/
│       │   └── Toast.tsx        (ToastContainer overlay)
│       └── index.ts
│
├── shared/                      ← Partagé entre toutes les features
│   ├── hooks/
│   │   └── usePolling.ts        (Generic polling hook, 30s min)
│   ├── utils/
│   │   ├── constants.ts         (API_BASE_URL, POLLING_INTERVAL, COLORS)
│   │   ├── validation.ts
│   │   ├── logger.ts
│   │   └── errorHandler.ts
│   ├── types/
│   │   └── common.types.ts      (ApiError)
│   └── config/
│       └── apiClient.ts         (Axios instance + interceptors + injection callbacks)
│
├── navigation/
│   ├── RootNavigator.tsx        (Auth → App conditional)
│   ├── AuthStack.tsx
│   ├── AppTabs.tsx              (TabsNavigator obligatoire)
│   └── NavigationTypes.ts
│
└── App.tsx                      (Entry point + Providers)
```

---

## 3. Gestion d'État avec Context API + useReducer

### Principe

La consigne impose **Context API + useReducer uniquement** (pas Redux, pas Zustand).

Chaque feature a son propre Context avec un Reducer associé.

### Pattern Standard

```typescript
// features/auth/contexts/AuthContext.tsx

import React, { createContext, useContext, useReducer } from 'react';
import { AuthState, AuthAction } from '../types/auth.types';

// 1. Types
interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

// 2. Context
const AuthContext = createContext<AuthContextType>(null!);

// 3. Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

// 4. Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: true, // true au démarrage (vérification token)
  error: null,
};

// 5. Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6. Hook d'accès
export const useAuth = () => useContext(AuthContext);
```

### Les 4 Contexts

#### AuthContext
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };
```

#### LobbyContext
```typescript
// Les joueurs sont inclus dans l'objet session retourné par l'API (session.players)
// → pas besoin d'un champ players séparé
interface LobbyState {
  currentSession: GameSession | null;
  loading: boolean;
  error: string | null;
}

type LobbyAction =
  | { type: 'SET_SESSION'; payload: GameSession | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_SESSION' };
```

#### GameContext
```typescript
interface GameState {
  map: GameMap | null;
  gameStatus: GameStatus | null;
  loading: boolean;
  error: string | null;
}

type GameAction =
  | { type: 'SET_MAP'; payload: GameMap }
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
```

#### UIContext
```typescript
interface UIState {
  toasts: Toast[];
  modal: Modal | null;
}

type UIAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SHOW_MODAL'; payload: Modal }
  | { type: 'HIDE_MODAL' };
```

---

## 4. App.tsx - Imbrication des Providers

```typescript
// App.tsx
export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <LobbyProvider>        {/* ajouté au Sprint 2 */}
          <GameProvider>       {/* ajouté au Sprint 4 */}
            <NavigationContainer>
              <StatusBar style="light" />
              <RootNavigator />
              <ToastContainer />
            </NavigationContainer>
          </GameProvider>
        </LobbyProvider>
      </AuthProvider>
    </UIProvider>
  );
}
```

---

## 5. Navigation

```typescript
// navigation/RootNavigator.tsx
export const RootNavigator = () => {
  const { state } = useAuth();

  if (state.loading) return <SplashScreen />;
  if (!state.token) return <AuthStack />;
  return <AppTabs />;
};
```

```
RootNavigator
├── SplashScreen (vérification token au démarrage)
├── AuthStack (Stack Navigator)
│   ├── LoginScreen
│   └── SignUpScreen
└── AppTabs (Tab Navigator - OBLIGATOIRE)
    ├── LobbyTab (Stack)
    │   ├── LobbyHomeScreen
    │   ├── CreateSessionScreen
    │   ├── JoinSessionScreen
    │   └── SessionDetailScreen
    ├── GameTab (Stack)
    │   ├── GameScreen
    │   └── GameOverScreen
    └── ProfileTab (Stack)
        └── ProfileScreen
```

---

## 6. API Client avec Interceptors

```typescript
// shared/config/apiClient.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
  baseURL: 'https://space-conquest-online.osc-fr1.scalingo.io/api',
  timeout: 10000,
});

// Request interceptor - ajoute le token automatiquement
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - gère les 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Supprimer le token et déclencher logout
      await SecureStore.deleteItemAsync('access_token');
      // Navigation vers Login (via un event ou NavigationRef)
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 7. Hooks Partagés

### usePolling
```typescript
// shared/hooks/usePolling.ts
// Hook générique de polling HTTP — réutilisé dans lobby (liste joueurs) et game (état de jeu)
export const usePolling = (
  callback: () => Promise<void>,
  interval: number = POLLING_INTERVAL_MS, // 30s par défaut
  enabled: boolean = true,
): void => {
  // Ref pour toujours avoir la dernière version du callback
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Force minimum 30s (rate limit API : 20 req/min)
  const safeInterval = Math.max(interval, POLLING_INTERVAL_MS);

  useEffect(() => {
    if (!enabled) return;
    tick(); // Appel immédiat au montage
    const timer = setInterval(tick, safeInterval);
    return () => clearInterval(timer);
  }, [enabled, safeInterval]);
};
```

### Hooks spécifiques par feature
Chaque feature implémente ses propres hooks de récupération API (`useLogin`, `useRegister`, `useLobby`, `useGame`) qui encapsulent : appel service + gestion loading/error + dispatch dans le context. Ce pattern est plus explicite qu'un hook générique `useApi` et permet un typage précis de chaque opération.

---

## 8. Services

```typescript
// features/auth/services/authService.ts
import apiClient from '../../../shared/config/apiClient';
import { LoginRequest, AuthResponse, RegisterRequest } from '../types/auth.types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};
```

---

## 9. Bonnes Pratiques

### ✅ DO
- Utiliser `useContext` uniquement via le hook custom (`useAuth()`, `useLobby()`...)
- Mettre la logique métier dans les services, pas dans les composants
- Cleanup des effets (`useEffect` return `clearInterval` pour le polling)
- Gérer les erreurs réseau systématiquement
- TypeScript strict - définir tous les types

### ❌ DON'T
- Pas de logique API directement dans les composants
- Pas d'imports croisés entre features (utiliser `shared/`)
- Pas d'état global dans plusieurs contexts (chaque feature gère le sien)
- Pas de `any` TypeScript sauf cas exceptionnels commentés
- Ne jamais stocker de tokens dans `AsyncStorage` (utiliser `SecureStore`)

---

## 10. Installation & Setup

```bash
# 1. Créer le projet Expo
npx create-expo-app@latest space-conquest-online --template blank-typescript
cd space-conquest-online

# 2. Installer les dépendances
npm install axios
npm install expo-secure-store
npm install expo-camera expo-barcode-scanner
npm install react-native-qrcode-svg
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# 3. Créer la structure de dossiers
mkdir -p src/features/{auth,lobby,game,ui}/{contexts,services,screens,components,hooks,types}
mkdir -p src/shared/{hooks,utils,types,config}
mkdir -p src/navigation
```

---

**Status** : Prête pour implémentation
**Date** : 24 mars 2026 (mis à jour 25 mars 2026)
