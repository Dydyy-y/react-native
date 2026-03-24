# Architecture - Space Conquest Online Mobile

**Date** : 23 mars 2026  
**Version** : 1.0  
**Status** : Sprint Planning

---

## 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│         React Native + Expo + TypeScript                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┬──────────────┬─────────────┐           │
│  │   Auth      │   Lobby      │   Game      │           │
│  │  Screens    │   Screens    │   Screens   │           │
│  └─────────────┴──────────────┴─────────────┘           │
│           ↓           ↓            ↓                     │
│  ┌────────────────────────────────────────┐             │
│  │       Navigation Stack + Tabs          │             │
│  └────────────────────────────────────────┘             │
│           ↓                                              │
│  ┌────────────────────────────────────────┐             │
│  │     Context API + useReducer            │             │
│  │  (Auth, Game, Lobby, UI State)         │             │
│  └────────────────────────────────────────┘             │
│           ↓                                              │
│  ┌────────────────────────────────────────┐             │
│  │   Custom Hooks (API, Polling)          │             │
│  └────────────────────────────────────────┘             │
│           ↓                                              │
│  ┌────────────────────────────────────────┐             │
│  │   API Service Layer (REST)             │             │
│  │   Base URL: https://space-conquest...  │             │
│  └────────────────────────────────────────┘             │
│
└─────────────────────────────────────────────────────────┘
```

---

## 2. Structure du Projet

```
my-app/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Point d'entrée principal
│   │   ├── Navigation.tsx              # Configuration de la navigation
│   │   └── RootNavigator.tsx           # Navigation racine (Auth → App)
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx             # Contexte d'authentification
│   │   ├── GameContext.tsx             # État de la partie en cours
│   │   ├── LobbyContext.tsx            # Salon d'attente (session)
│   │   └── UIContext.tsx               # État UI global (toasts, modals, etc.)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                  # Hook d'authentification
│   │   ├── useGame.ts                  # Hook pour l'état du jeu
│   │   ├── useLobby.ts                 # Hook pour le lobbys
│   │   ├── useApi.ts                   # Hook pour les appels API génériques
│   │   ├── usePolling.ts               # Hook pour le polling HTTP
│   │   ├── useSecureStorage.ts         # Hook pour le stockage sécurisé
│   │   └── useQRScanner.ts             # Hook pour le scan QR
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts               # Instance Axios/Fetch configurée
│   │   │   ├── endpoints.ts            # Énumération des endpoints
│   │   │   └── interceptors.ts         # Middleware (auth, erreurs)
│   │   │
│   │   ├── auth/
│   │   │   ├── authService.ts          # POST /register, /login
│   │   │   └── tokenStorage.ts         # SecureStore pour tokens
│   │   │
│   │   ├── game/
│   │   │   ├── sessionService.ts       # Gestion sessions (create, join, leave)
│   │   │   ├── lobbyService.ts         # Récupération infos lobby
│   │   │   ├── gameService.ts          # État partie, carte, actions
│   │   │   └── pollingService.ts       # Polling pour updates lobby/game
│   │   │
│   │   └── qr/
│   │       └── qrService.ts            # Génération/lecture QR codes
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   │
│   │   ├── lobby/
│   │   │   ├── LobbyListScreen.tsx     # Créer/rejoindre sesssion
│   │   │   ├── LobbyWaitScreen.tsx     # Attendre dans le salon
│   │   │   ├── CreateSessionScreen.tsx # Créer et afficher QR
│   │   │   ├── JoinSessionScreen.tsx   # Scanner QR
│   │   │   └── SessionDetailScreen.tsx # Vue d'attente détaillée
│   │   │
│   │   └── game/
│   │       ├── GameScreen.tsx          # Écran principal jeu (carte + état)
│   │       ├── MapScreen.tsx           # Affichage de la grille/carte
│   │       ├── GameStateScreen.tsx     # État joueur (ressources, stats)
│   │       ├── ActionsScreen.tsx       # Sélection actions tour (bonus)
│   │       └── RoundResultScreen.tsx   # Résultats tour (bonus)
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBanner.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── game/
│   │   │   ├── GameMap.tsx             # Grille avec entités
│   │   │   ├── MapCell.tsx             # Cellule individuelle
│   │   │   ├── ShipIcon.tsx            # Icône vaisseau
│   │   │   ├── ResourceNode.tsx        # Icône ressource
│   │   │   ├── PlayerStats.tsx         # Panneau stats joueur
│   │   │   └── RoundInfo.tsx           # Infos tour
│   │   │
│   │   ├── lobby/
│   │   │   ├── PlayerList.tsx          # Liste joueurs dans lobby
│   │   │   ├── PlayerItem.tsx          # Item joueur
│   │   │   ├── SessionInfo.tsx         # Infos session (nom, créateur)
│   │   │   ├── QRDisplay.tsx           # Affichage QR code
│   │   │   ├── QRScanner.tsx           # Scanner QR
│   │   │   └── ModerationPanel.tsx     # Boutons kick/ban (créateur only)
│   │   │
│   │   └── auth/
│   │       ├── AuthForm.tsx
│   │       ├── InputField.tsx
│   │       └── ErrorMessage.tsx
│   │
│   ├── types/
│   │   ├── api.types.ts                # Types réponses API
│   │   ├── auth.types.ts               # Types Auth (User, Token)
│   │   ├── game.types.ts               # Types Game (Session, Player, Ship)
│   │   ├── map.types.ts                # Types Carte (Grid, Cell, Entity)
│   │   └── common.types.ts             # Types communs (ErrorResponse, etc.)
│   │
│   ├── utils/
│   │   ├── constants.ts                # Constantes globales
│   │   ├── validation.ts               # Validations (email, password, etc.)
│   │   ├── formatter.ts                # Formatage données (coords, dates)
│   │   ├── logger.ts                   # Logging centralisé
│   │   └── errorHandler.ts             # Gestion erreurs centralisée
│   │
│   ├── config/
│   │   ├── apiConfig.ts                # Config API (baseURL, timeout)
│   │   └── appConfig.ts                # Config app (polling intervals)
│   │
│   └── index.ts                        # Export point (réexport de App)
│
├── package.json
├── tsconfig.json
├── app.json (Expo config)
├── .env.example
└── assets/

```

---

## 3. Gestion d'État (Context API + Reducers)

### 3.1 AuthContext
**Responsabilités** :
- Stockage de l'utilisateur connecté
- Token d'authentification
- État de chargement/erreur
- Actions : login, register, logout, refreshToken

**Actions du Reducer** :
```
- SET_USER(user)
- SET_TOKEN(token)
- SET_LOADING(bool)
- SET_ERROR(error)
- LOGOUT()
- CLEAR_ERROR()
```

### 3.2 LobbyContext
**Responsabilités** :
- Session de jeu actuelle
- Liste des joueurs dans le salon
- Informations du salon (id, nom, créateur)
- État du salon (waiting, running, deleted, banned)

**Actions du Reducer** :
```
- SET_SESSION(session)
- SET_PLAYERS(players)
- UPDATE_PLAYER(player)
- REMOVE_PLAYER(playerId)
- SET_SESSION_STATE(state)
- CLEAR_SESSION()
```

### 3.3 GameContext
**Responsabilités** :
- État actuel de la partie
- Données de la carte (grille, nœuds ressources)
- État du joueur (ressources, tour, vaisseaux)
- Statistiques du joueur

**Actions du Reducer** :
```
- SET_MAP(map)
- SET_GAME_STATE(state)
- UPDATE_SHIPS(ships)
- UPDATE_RESOURCES(ore)
- SET_ROUND(round)
- UPDATE_STATS(stats)
- SET_ACTIONS_SUBMITTED(bool)
```

### 3.4 UIContext
**Responsabilités** :
- Toasts (messages temporaires)
- Modales
- Erreurs transversales
- État de chargement global

**Actions du Reducer** :
```
- SHOW_TOAST(message, type)
- HIDE_TOAST()
- SHOW_MODAL(type, data)
- HIDE_MODAL()
- SET_GLOBAL_ERROR(error)
- CLEAR_GLOBAL_ERROR()
```

---

## 4. Navigation

### 4.1 RootNavigator
```typescript
if (authState.isLoading) {
  return <SplashScreen />
}

if (!authState.user) {
  return <AuthStack /> // Login, SignUp
} else {
  return <AppTabs /> // Lobby, Game, Profile
}
```

### 4.2 AuthStack
- LoginScreen
- SignUpScreen

### 4.3 AppTabs (BottomTabNavigator)
- **Tab 1: Lobby**
  - LobbyListScreen
  - CreateSessionScreen
  - JoinSessionScreen
  - SessionDetailScreen
  
- **Tab 2: Game** (si session running)
  - GameScreen (carte + état)
  - MapScreen
  - ActionsScreen (bonus)

- **Tab 3: Profile** (bonus)
  - ProfileScreen
  - SettingsScreen

---

## 5. Flux de Données

### 5.1 Flux d'Authentification
```
SignUpScreen → authService.register() → API → ✓ Token stocké → AuthContext updated → AppTabs
    ↓ Erreur
    └─→ UIContext.showToast(error)

LoginScreen → authService.login() → API → ✓ Token stocké → AuthContext updated → AppTabs
    ↓ Erreur
    └─→ UIContext.showToast(error)
```

### 5.2 Flux Lobby
```
CreateSessionScreen → sessionService.createSession() 
    → API → sessionId + QR data 
    → LobbyContext.setSession() 
    → SessionDetailScreen (polling!)

JoinSessionScreen → QRScanner → sessionService.joinSession(code)
    → API → sessionId
    → LobbyContext.setSession()
    → SessionDetailScreen (polling!)

SessionDetailScreen ← usePolling(30s) ← lobbyService.getSessionInfo()
    → LobbyContext.setPlayers() / updatePlayer() / removePlayer()
    
Creator: Buttons [Kick, Ban, Delete, Start]
    → sessionService.kickPlayer() / banPlayer() / deleteSession() / startGame()
    → LobbyContext updated or REDIRECT to GameScreen
```

### 5.3 Flux Jeu
```
GameScreen (au montage):
    1. gameService.getGameMap() → GameContext.setMap()
    2. gameService.getGameState() → GameContext.setGameState()
    3. [BONUS] usePolling(?) pour updates état

GameMap Component:
    - Affiche grille de (width x height)
    - Affiche resource_nodes aux positions
    - Affiche ships (vaisseaux) aux positions
    - Affiche stats du joueur

[BONUS] ActionsScreen → Sélection actions → gameService.submitActions()
[BONUS] Polling détecte fin du tour → Affiche résultats
```

---

## 6. Services API

### 6.1 Client API (Axios / Fetch)
```typescript
// Base URL
const BASE_URL = "https://space-conquest-online.osc-fr1.scalingo.io/api"

// Headers
- Authorization: `Bearer ${token}`
- Content-Type: application/json

// Interceptors
- Request: Ajouter token si disponible
- Response: Gérer 401 (logout), 4xx (toast), 5xx (toast)
```

### 6.2 Endpoints utilisés (par étape)

**Étape 1 - Auth**
- `POST /register` → Register
- `POST /login` → Login

**Étape 2 - Lobby**
- `POST /sessions` → Create session
- `GET /sessions/{id}` → Get session info
- `POST /sessions/{id}/join` → Join session
- `POST /sessions/{id}/leave` → Leave session

**Étape 3 - Modération**
- `POST /sessions/{id}/kick` → Kick player
- `POST /sessions/{id}/ban` → Ban player
- `DELETE /sessions/{id}` → Delete session
- `POST /sessions/{id}/start` → Start game

**Étape 4 - Game**
- `GET /games/{id}/map` → Get game map
- `GET /games/{id}/state` → Get game state
- `POST /games/{id}/actions` → Submit actions (bonus)
- `GET /games/{id}/results` → Get turn results (bonus)

---

## 7. Stockage Sécurisé

**Token d'authentification**:
- Utiliser `expo-secure-store` (ou `@react-native-async-storage/async-storage` + chiffrement)
- Stockage au login, lecture au montage App, suppression au logout

**Pas de stockage**:
- Données sensibles en session (RAM seulement)
- Données non-sensibles (state global via Context)

---

## 8. Stratégie Polling

### 8.1 Lobby Polling
- **Intervalle** : 30 secondes (contrainte API : 20 req/min MAX)
- **Condition** : Actif seulement si utilisateur dans SessionDetailScreen
- **Arrêt** : Quand usager quitte écran ou session supprimée/ban

### 8.2 Game Polling (Bonus)
- **Intervalle** : À déterminer (ne pas dépasser rate limit)
- **Condition** : Actif seulement si GameScreen monté
- **Arrêt** : Quand partie terminée (1 seul joueur avec vaisseaux)

---

## 9. Types TypeScript Clés

```typescript
// Auth
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthToken {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
}

// Game Session
interface GameSession {
  id: string;
  name: string;
  creator_id: string;
  state: "waiting" | "running" | "finished";
  players: Player[];
  created_at: string;
}

interface Player {
  id: string;
  username: string;
  user_id: string;
  is_creator: boolean;
}

// Game Map & State
interface GameMap {
  width: number;
  height: number;
  resource_nodes: Array<{ x: number; y: number }>;
}

interface GameState {
  round: number;
  resource: { ore: number };
  stats: PlayerStats;
  ships: Ship[];
  round_actions_submitted: boolean;
}

interface Ship {
  id: string;
  position: { x: number; y: number };
  owner_id: string;
  health: number;
}

interface PlayerStats {
  ships_destroyed: number;
  resources_collected: number;
  // ... autres stats
}
```

---

## 10. Bonnes Pratiques Appliquées

✅ **Architecture** :
- Séparation claire concerns (services/contexts/hooks/screens)
- Scalabilité (facile d'ajouter nouvelles features)
- Testabilité (logique centralisée)

✅ **State Management** :
- Context API + useReducer (pas Redux)
- Un contexte par domaine métier
- Custom hooks pour encapsuler logique

✅ **API** :
- Client centralisé avec interceptors
- Gestion erreurs unifiée
- Polling bien contrôlé (respect rate limits)

✅ **Sécurité** :
- Token en secure storage
- Validation côté client
- Gestion 401 (re-login)

✅ **UX/UI** :
- Navigation fluide (auth → lobby → game)
- Feedback utilisateur (toasts, loading, erreurs)
- Gestion cas partiels (session supprimée, banned, etc.)

---

## 11. Checklist Développement

- [ ] **Fondations** : Navigation, Auth Context, API Client
- [ ] **Étape 1** : Login/SignUp screens + authService
- [ ] **Étape 2** : Lobby screens + sessionService + Polling
- [ ] **Étape 3** : Modération (kick/ban/delete/start)
- [ ] **Étape 4** : Game map + state display
- [ ] **Bonus** : Actions submission, turn results, refresh token
- [ ] **Polish** : Error handling, Loading states, Edge cases

---

## 12. Variables d'Environnement (.env)

```
EXPO_PUBLIC_API_BASE_URL=https://space-conquest-online.osc-fr1.scalingo.io/api
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_POLLING_INTERVAL=30000
EXPO_PUBLIC_LOG_LEVEL=info
```

---

**Fin de l'Architecture Document**
