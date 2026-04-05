# Preparation a l'oral — Space Conquest Online

> Ce document te prepare a expliquer et justifier chaque partie du code lors de la code review.
> Pour chaque section : ce que ca fait, pourquoi ce choix, et les questions pieges possibles.

---

## 1. Architecture globale

### Structure Feature-Folder

```
src/
  features/auth/    → tout ce qui touche a l'authentification
  features/lobby/   → creation/gestion de sessions
  features/game/    → carte, actions, fin de partie
  features/ui/      → toasts, composants partages
  shared/           → config, hooks, utils transverses
  navigation/       → navigateurs (Stack, Tabs)
```

**Pourquoi ?**
- Chaque feature est autonome : ses propres types, services, hooks, ecrans, composants
- On peut travailler sur une feature sans toucher les autres
- Alternative rejetee : architecture par type (`screens/`, `services/`, `hooks/`) — ca melange les features et rend la navigation dans le code plus difficile

**Question piege : "Pourquoi des imports croises entre features (auth importe dans game) ?"**
- Certains contexts sont transverses par nature : `useAuth()` (savoir qui est connecte) et `useUI()` (afficher des toasts) sont utilises partout
- On aurait pu les mettre dans `shared/`, mais ce sont des features avec leur propre logique (reducer, provider). Les deplacer casserait la coherence feature-folder
- Le compromis : on autorise l'import des *hooks de lecture* (`useAuth`, `useUI`) depuis d'autres features, mais jamais de logique interne

---

## 2. Gestion d'etat : Context API + useReducer

### 4 Contexts separes

| Context | Responsabilite | Pourquoi separe ? |
|---------|---------------|-------------------|
| `AuthContext` | user, token, loading, error | Evite de re-render tout le jeu quand le token change |
| `LobbyContext` | session courante, joueurs | Isole le polling lobby du reste |
| `GameContext` | carte, etat jeu, actions, shipTypes | Le plus gros state, isole pour la performance |
| `UIContext` | toasts | Tres leger, change souvent, ne doit pas trigger de re-renders lourds |

**Pourquoi useReducer et pas useState ?**
- `useReducer` centralise les transitions d'etat dans un seul endroit (le reducer)
- Les actions sont typees (`SET_USER`, `SET_TOKEN`, `LOGOUT`...) — on peut tracer chaque changement
- Pour un state avec plusieurs champs lies, useReducer evite les appels multiples a setState

**Pourquoi pas Redux/Zustand ?**
- Contrainte du sujet : "Context API en combinaison avec des reducers"
- Pour un projet de cette taille, Context + useReducer est suffisant
- Redux ajouterait du boilerplate inutile (store, slices, middleware)

**Question piege : "Est-ce que ca cause des re-renders inutiles ?"**
- Oui, c'est le defaut connu de Context API. Quand le state change, tous les consumers re-render
- Mitigation : on a 4 contexts separes (pas un seul gros), et les composants lourds (`MapCell`) sont wrapes avec `React.memo`
- `GameContext` utilise `useMemo` sur sa valeur pour eviter les re-renders quand dispatch ne change pas

---

## 3. Appels API : Axios + injection de dependances

### Pattern apiClient

```typescript
// shared/config/apiClient.ts
let _getToken: TokenGetter | null = null;
let _onUnauthorized: UnauthorizedHandler | null = null;

export const configureApiClient = (getToken, onUnauthorized) => { ... };
```

**Pourquoi l'injection plutot qu'un import direct du token ?**
- `apiClient.ts` est dans `shared/` — il ne peut PAS importer depuis `features/auth/` (import circulaire)
- `AuthProvider` configure les callbacks au montage via `configureApiClient(getToken, logout)`
- Ca respecte le principe de separation : `apiClient` ne sait pas d'ou vient le token

**Les 2 interceptors :**
1. **Request** : ajoute automatiquement `Authorization: Bearer {token}` a chaque requete
   - Avantage : pas besoin de passer le token manuellement dans chaque appel service
2. **Response** : detecte les 401, declenche le logout automatique
   - Exclut les routes `/auth/` (un 401 sur login = "mauvais mot de passe", pas un token expire)

**Question piege : "Pourquoi un `logoutRef` dans AuthContext ?"**
- `configureApiClient` est appele une seule fois au montage (useEffect avec `[]`)
- Si on passait `logout` directement, ca capturerait la premiere version (closure perimee)
- Le `ref` pointe toujours vers la derniere version de `logout`, meme si le composant re-render

---

## 4. Stockage securise du token

```typescript
// expo-secure-store sur natif, localStorage sur web (fallback dev)
const isWeb = Platform.OS === 'web';
```

**Pourquoi expo-secure-store ?**
- Stocke dans le Keychain iOS / Keystore Android (chiffrement materiel)
- Contrainte du sujet : "stocker de maniere securisee"
- `AsyncStorage` stocke en clair — inacceptable pour un token d'auth

**Pourquoi le fallback web ?**
- `expo-secure-store` ne fonctionne pas sur web
- `localStorage` permet de tester dans le navigateur pendant le dev
- En production mobile, c'est toujours SecureStore qui est utilise

---

## 5. Polling HTTP

### usePolling (hook generique)

```typescript
export const usePolling = (callback, interval, enabled) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  // ...
  const safeInterval = Math.max(interval, POLLING_INTERVAL_MS); // min 30s
};
```

**Pourquoi un ref pour le callback ?**
- Sans ref, chaque changement du callback relancerait le timer (clearInterval + setInterval)
- Avec ref, le timer reste stable et appelle toujours la derniere version du callback
- Pattern recommande par la doc React pour les intervalles

**Pourquoi forcer 30s minimum ?**
- Rate limit API : 20 req/min
- 30s = 2 req/min, largement sous la limite
- `safeInterval = Math.max(interval, 30000)` empeche toute erreur d'appel

**Ou est utilise le polling ?**
1. **SessionDetailScreen** : `refreshSession()` toutes les 30s — detecte nouveaux joueurs, kick/ban, game start
2. **GameScreen** : `loadState()` toutes les 30s — detecte nouveau tour, fin de partie

**Question piege : "Pourquoi le polling du jeu ne tourne pas tout le temps ?"**
- Le polling ne demarre qu'apres soumission des actions (`round_actions_submitted === true`)
- Tant que le joueur joue son tour, l'etat ne change pas — inutile de polluer l'API
- Exception : joueur elimine — il n'a plus d'actions a soumettre mais doit continuer a observer
- D'ou la condition : `gameStatus.round_actions_submitted || joueur n'a plus de vaisseaux`

---

## 6. Navigation

### Structure a 3 niveaux

```
RootNavigator (conditionnel, pas de NavigationContainer)
  ├── SplashScreen           (isLoading === true)
  ├── AuthStack              (user === null)
  │     ├── Login
  │     └── SignUp
  └── AppTabs                (user !== null)
        ├── Lobby (Stack)
        │     ├── LobbyHome
        │     ├── CreateSession
        │     ├── JoinSession
        │     └── SessionDetail
        ├── Game (Stack)
        │     ├── GameMain
        │     └── GameOver
        └── Profile (Stack)
              ├── ProfileMain
              └── GameHistory
```

**Pourquoi des Stacks dans les Tabs ?**
- Chaque tab a sa propre pile de navigation (push/pop)
- Le joueur peut aller de LobbyHome → CreateSession → SessionDetail sans affecter les autres tabs
- `headerLeft: () => null` sur SessionDetail empeche le retour accidentel pendant une session

**Pourquoi RootNavigator est conditionnel (pas un Stack) ?**
- On ne veut pas d'animation de transition entre auth et app
- On veut empecher le retour vers login une fois connecte
- Le rendu conditionnel (`if (!user) return <AuthStack />;`) est le pattern recommande par React Navigation

---

## 7. La carte du jeu (FlatList)

### Pourquoi FlatList et pas un autre composant ?

- Le sujet dit explicitement : "il est tres fortement recommande d'utiliser uniquement un composant FlatList"
- `numColumns={map.width}` transforme la FlatList en grille
- `scrollEnabled={false}` desactive le scroll (la carte est dans un ScrollView parent)

### Optimisation performance

```typescript
// MapCell est memo (React.memo) — ne re-render que si ses props changent
export const MapCell = memo(({ ... }: MapCellProps) => { ... });

// getItemLayout evite la mesure dynamique de chaque cellule
getItemLayout={(_data, index) => ({
  length: cellSize,
  offset: cellSize * Math.floor(index / map.width),
  index,
})}
```

**Pourquoi le fond uni ?**
- Le sujet dit : "n'affichez pas une image sur chaque case" pour la performance
- On utilise un fond uni (`COLORS.primary`) sous la grille
- Les icones (Ionicons) n'apparaissent que sur les cases avec vaisseau ou ressource

### Index par position (shipsByPos)

```typescript
const shipsByPos = useMemo(() => {
  const m = new Map<string, Ship[]>();
  ships.forEach(s => m.set(`${s.x},${s.y}`, ...));
  return m;
}, [ships]);
```

**Pourquoi ?**
- Sans index, pour chaque cellule on ferait `ships.filter(s => s.x === x && s.y === y)` → O(n*m)
- Avec la Map, c'est O(1) par cellule → O(n) total
- Calcule une seule fois dans GameScreen et passe a GameMap (pas de double calcul)

---

## 8. Actions de jeu (move, attack, purchase)

### Flux d'une action

```
1. Joueur selectionne son vaisseau (tap sur case)
   → selectedShip = ship, ActionPanel s'affiche

2. Joueur choisit "Deplacer" ou "Attaquer"
   → selectionMode = { kind: 'move', ship } ou { kind: 'attack', ship }
   → rangeCells calcule les cases a portee (distance de Manhattan)
   → cases en surbrillance verte

3. Joueur tape sur une case cible
   → validation locale (portee, case libre, ennemi present...)
   → addAction({ type: 'move', ship_id, target_x, target_y })
   → action ajoutee a pendingActions[]

4. Joueur valide → POST /game-sessions/{id}/round-actions
   → si valide : clear actions, round_actions_submitted = true, polling demarre
   → si invalide : Alert avec les erreurs du serveur, joueur corrige et renvoie
```

### Calcul de portee (distance de Manhattan)

```typescript
// |dx| + |dy| <= range (pas de diagonale libre)
if (Math.abs(dx) + Math.abs(dy) > range) continue;
```

**Pourquoi Manhattan et pas Euclidienne ?**
- C'est le standard pour les grilles en strategie au tour par tour
- Un vaisseau avec speed=2 peut aller 2 cases en ligne ou 1+1 en diagonale
- Plus intuitif pour le joueur que des cercles sur une grille carree

### Achat de vaisseau (purchase)

```
1. Joueur ouvre la boutique (ShipShop)
2. Choisit un type → selectionMode = { kind: 'recruit_placement', shipTypeId }
3. Tape sur une case libre → action { type: 'purchase', ship_type_id, target_x, target_y }
```

**Validation locale avant envoi :**
- Case libre (pas de vaisseau dessus)
- Assez de minerai (verifie dans ShipShop via `ore >= item.cost`)
- Pas de doublon d'action par vaisseau

---

## 9. Gestion des erreurs

### 3 niveaux de gestion

1. **Validation client** (avant l'appel API) : champs requis, format email, mdp >= 8 chars
2. **errorHandler.ts** : traduit les erreurs API Laravel en francais, gere les formats multiples
3. **Toasts** : affichage non-intrusif des messages d'erreur/succes

```typescript
// Format Laravel : { errors: { field: ["msg1", "msg2"] } }
// → On extrait et traduit chaque message
const ERROR_TRANSLATIONS = {
  'Invalid credentials': 'Email ou mot de passe incorrect',
  'The email has already been taken.': 'Cette adresse email est deja utilisee',
  // ...
};
```

**Pourquoi traduire au lieu d'afficher tel quel ?**
- L'API renvoie en anglais, l'app est en francais
- Les messages bruts ("The password confirmation does not match") sont peu clairs pour l'utilisateur

---

## 10. Elimination et fin de partie

### Detection de l'elimination

```typescript
const isEliminated = ships.filter(s => s.player_id === currentUserId).length === 0;
```

- Calcule a partir de l'etat du jeu (pas de flag serveur special)
- Si elimine : bandeau rouge, actions desactivees, mais carte toujours visible et polling actif

### Transition vers GameOver

```typescript
useEffect(() => {
  if (gameStatus?.status === 'finished' && activeSessionId) {
    navigation.navigate('GameOver', { sessionId: activeSessionId });
  }
}, [gameStatus?.status]);
```

- Detecte automatiquement quand le serveur passe `status` a `finished`
- Navigue vers `GameOverScreen` qui charge les stats via `GET /game-sessions/{id}/stats`

---

## 11. Profil et historique

### Modification du profil

- Seuls les champs modifies sont envoyes (`PUT /profile`)
- Si rien n'a change, pas d'appel API (comparaison avec `state.user`)
- Mot de passe optionnel, avec confirmation

### Historique des parties

- Pagination server-side (`page=1`, `page=2`...)
- `onEndReached` sur la FlatList charge la page suivante
- Tap sur une partie → charge les stats detaillees inline

---

## 12. Questions frequentes a l'oral

**"Pourquoi pas de tests ?"**
→ Le sujet ne les demande pas explicitement. Le temps a ete investi dans la qualite du code et la couverture fonctionnelle.

**"Pourquoi pas de refresh token ?"**
→ C'est un bonus du sujet. Le type `AuthResponse` inclut les champs `refresh_token`, pret pour une implementation future, mais l'access token de 24h est suffisant pour la demo.

**"Comment geres-tu la perte reseau ?"**
→ Axios timeout de 10s + message d'erreur "Erreur reseau" dans `errorHandler.ts`. Le polling echoue silencieusement et reessaye au prochain intervalle.

**"Pourquoi pas de WebSocket ?"**
→ Le sujet interdit les mecaniques temps reel : "il n'existe aucune mecanique en temps reel comme des Websockets. Vous devrez effectuer un polling HTTP."

**"Comment evites-tu le rate limit ?"**
→ Polling minimum 30s (force par `usePolling`), soit 2 req/min. Limite API = 20 req/min. Marge confortable.

**"Un joueur peut-il tricher en modifiant le client ?"**
→ Non. Toutes les regles (portee, cout, tour) sont verifiees cote serveur. Le client ne fait que de la validation UX pour eviter des appels API inutiles.

**"Pourquoi `expo-camera` et pas `react-native-camera` ?"**
→ `expo-camera` est la solution officielle Expo, zero config native. `react-native-camera` est deprecie et necesite un eject.
