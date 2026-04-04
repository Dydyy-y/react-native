# PRD - Étape 2 : Créer, Rejoindre ou Quitter une Session de Jeu

**Date** : 23 mars 2026 (mis à jour 04 avril 2026)  
**Version** : 2.0  
**Status** : A développer  
**Sprint** : 2

---

## 1. Objectif

Permettre aux joueurs de créer une nouvelle session de jeu, de rejoindre une session existante via QR Code, et de gérer l'état du salon avant le démarrage de la partie.

**Critères de succès** :
- Joueurs peuvent créer une session et obtenir un QR code d'invitation
- Joueurs peuvent rejoindre une session en scannant le QR code
- Liste des joueurs dans le salon mise à jour via polling HTTP (30s)
- Joueurs non-créateur peuvent quitter le salon tant que la partie n'a pas démarré

---

## 2. User Stories

### US 2.1 - Créer une session de jeu

**En tant que** joueur  
**Je veux** créer une nouvelle session et inviter d'autres joueurs  
**Afin de** lancer une partie avec mes amis

**Critères d'acceptation** :

1. **Interface CreateSessionScreen**
   - [ ] Accessible depuis LobbyHomeScreen
   - [ ] Input session name : placeholder "Nom de la partie"
   - [ ] Button "Créer la session"
   - [ ] Loading spinner pendant création

2. **Appel API** (POST /sessions)
   - [ ] Body : `{ name }` (vérifier doc API pour les champs exacts)
   - [ ] Response : session avec id, name, creator_id, state, code d'invitation
   - [ ] En cas d'erreur : toast via UIContext

3. **Affichage QR Code**
   - [ ] QR Code contient le code d'invitation de la session
   - [ ] Message : "Invitez vos amis à scanner ce QR Code"
   - [ ] Redirection vers SessionDetailScreen avec polling activé

4. **State (Context API + useReducer)**
   - [ ] LobbyContext : `dispatch({ type: 'SET_SESSION', payload: session })`

---

### US 2.2 - Rejoindre une session

**En tant que** joueur  
**Je veux** rejoindre une session en scannant un QR Code  
**Afin de** jouer avec d'autres joueurs

**Critères d'acceptation** :

1. **Interface JoinSessionScreen**
   - [ ] Accessible depuis LobbyHomeScreen
   - [ ] Scanner QR Code via expo-camera
   - [ ] Permission caméra demandée à l'utilisateur
   - [ ] Preview caméra affichée

2. **Scan & Join**
   - [ ] QR scanné -> extraction code d'invitation
   - [ ] Appel API automatique pour rejoindre (vérifier endpoint dans doc API)
   - [ ] Erreurs gérées : session pleine, inexistante, déjà membre, banni
   - [ ] Toast d'erreur spécifique

3. **State & Navigation**
   - [ ] LobbyContext : `SET_SESSION` avec la session rejointe
   - [ ] Redirection vers SessionDetailScreen si succès

---

### US 2.3 - Affichage du salon en temps réel

**En tant que** joueur dans un salon  
**Je veux** voir la liste des joueurs mise à jour automatiquement  
**Afin de** vérifier que tout le monde est connecté

**Critères d'acceptation** :

1. **Interface SessionDetailScreen**
   - [ ] Header : "Salon : {session_name}"
   - [ ] Info : "Créateur : {creator_name}", "{players_count}/4 joueurs"
   - [ ] Liste joueurs : pour chaque joueur -> nom, badge créateur si applicable
   - [ ] Boutons en bas (Quitter + boutons créateur des US 3.x)

2. **Polling HTTP**
   - [ ] GET /sessions/{id} toutes les 30 secondes (rate limit : 20 req/min)
   - [ ] Démarré au mount de SessionDetailScreen
   - [ ] Arrêté au unmount
   - [ ] Arrêté si session.state === "running" -> redirection GameScreen
   - [ ] Arrêté si session supprimée (404) -> redirection LobbyHomeScreen
   - [ ] Utilise le hook partagé `usePolling` depuis `shared/hooks/usePolling.ts`

3. **Gestion des erreurs de polling**
   - [ ] Erreur réseau : toast, retry au prochain intervalle
   - [ ] 401 : logout automatique (interceptor Axios)
   - [ ] 404 : toast "Session supprimée" + redirection LobbyHomeScreen

---

### US 2.4 - Quitter le salon

**En tant que** joueur dans un salon non démarré  
**Je veux** pouvoir quitter le salon  
**Afin de** chercher une autre session

**Critères d'acceptation** :

1. **Bouton "Quitter"**
   - [ ] Visible si session.state === "waiting"
   - [ ] Invisible ou disabled si utilisateur === créateur (le créateur doit supprimer la session)
   - [ ] Confirmation modale avant action

2. **Appel API** (vérifier endpoint dans doc API — probablement POST /sessions/{id}/leave)
   - [ ] Succès : LobbyContext `CLEAR_SESSION` + redirection LobbyHomeScreen
   - [ ] Erreur : toast

---

## 3. Détails Techniques

### LobbyContext (Context API + useReducer)
```typescript
// Les joueurs sont inclus dans l'objet session retourné par l'API (session.players)
// → pas de champ players séparé, on évite la désynchronisation
interface LobbyState {
  currentSession: GameSession | null; // contient .players, .creator_id, .state, .code
  loading: boolean;
  error: string | null;
}

type LobbyAction =
  | { type: 'SET_SESSION'; payload: GameSession | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_SESSION' };
```

### Services
- `sessionService.createSession(name)` -> POST /sessions
- `sessionService.joinSession(code)` -> endpoint join (vérifier doc API)
- `sessionService.leaveSession(sessionId)` -> endpoint leave (vérifier doc API)
- `sessionService.getSessionInfo(sessionId)` -> GET /sessions/{id}

### Hooks (récupération API)
- `useLobby()` -> { session, loading, error, createSession, joinSession, leaveSession }

### Hook partagé
- `usePolling(callback, interval, enabled)` -> polling générique réutilisable

### API Endpoints (vérifier doc officielle)
- `POST /sessions` -> Create session
- `GET /sessions/{id}` -> Get session info (polling)
- `POST /sessions/{id}/join` -> Join session
- Endpoint leave (vérifier dans doc API)

---

## 4. Fichiers à Créer

```
src/features/lobby/
├── contexts/LobbyContext.tsx    (Context + Reducer + Provider + useLobby)
├── services/sessionService.ts   (create, join, leave, getSession, kick, ban, delete, start)
├── screens/
│   ├── LobbyHomeScreen.tsx      (écran d'accueil lobby : boutons créer/rejoindre)
│   ├── CreateSessionScreen.tsx  (création session + affichage QR code)
│   ├── JoinSessionScreen.tsx    (scanner QR code)
│   └── SessionDetailScreen.tsx  (détail session + polling + modération)
├── components/
│   ├── PlayerList.tsx           (liste joueurs FlatList)
│   ├── QRDisplay.tsx            (affichage QR code d'invitation)
│   └── QRScanner.tsx            (scanner QR code caméra)
├── hooks/useLobby.ts            (hook récupération API lobby)
├── types/lobby.types.ts
└── index.ts

src/shared/hooks/
└── usePolling.ts                (déjà créé — hook générique réutilisable)
```

---

## 5. Points d'Attention

- **Rate limit** : 20 req/min -> polling à 30s = 2 req/min, laisse de la marge
- **QR Code** : vérifier ce que l'API retourne comme données d'invitation
- **Consigne** : "Une session ne peut être rejointe que via l'utilisation d'un QR code"
- **Sessions limitées** à 4 joueurs (vérifié côté serveur)
