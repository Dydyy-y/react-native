# PRD - Étape 4 : Affichage de la Carte et de l'État de la Partie

**Date** : 23 mars 2026 (mis à jour 04 avril 2026)  
**Version** : 2.0  
**Status** : A développer  
**Sprint** : 4

---

## 1. Objectif

Afficher la carte du jeu et l'état actuel de la partie aux joueurs une fois que la partie a démarré.

**Critères de succès** :
- Carte affichée sous forme de grille lisible (FlatList obligatoire)
- Ressources visibles aux bonnes positions
- Vaisseaux des joueurs visibles avec couleurs distinctes
- État du joueur affiché (minerai, tour, stats, status actions)

---

## 2. User Stories

### US 4.1 - Affichage de la carte

**En tant que** joueur en jeu  
**Je veux** voir la carte du jeu avec tous les éléments  
**Afin de** comprendre la position de mes vaisseaux et des ressources

**Critères d'acceptation** :

1. **Interface GameScreen**
   - [ ] Header : "Tour {round}"
   - [ ] Grille principale (FlatList — consigne obligatoire)
   - [ ] Panneau stats joueur

2. **Récupération carte (une seule fois)**
   - [ ] GET /games/{gameId}/map au montage
   - [ ] Response : `{ width, height, resource_nodes: [{ x, y }] }`
   - [ ] PAS de polling (données statiques)
   - [ ] Stocké dans GameContext : `dispatch({ type: 'SET_MAP', payload: map })`

3. **Rendu Grille FlatList**
   - [ ] Grille de width x height cellules
   - [ ] Consigne performance : PAS d'image sur chaque case vide, fond uni sous la grille
   - [ ] Images/formes UNIQUEMENT sur cases avec vaisseau et/ou ressource
   - [ ] Ressources : couleur distinctive (ex: doré)
   - [ ] Vaisseaux : couleur par joueur, icône par type
   - [ ] Vaisseaux affichés au-dessus des ressources

4. **Récupération état initial**
   - [ ] GET /games/{gameId}/state au montage
   - [ ] Response contient : round, resource.ore, stats, ships, round_actions_submitted, status
   - [ ] Stocké dans GameContext : `dispatch({ type: 'SET_GAME_STATE', payload: state })`

---

### US 4.2 - Affichage de l'état du joueur

**En tant que** joueur en jeu  
**Je veux** voir mon état actuel  
**Afin de** connaître mes ressources et ma progression

**Critères d'acceptation** :

1. **PlayerStats Panel**
   - [ ] Tour actuel : `round`
   - [ ] Minerai : `resource.ore`
   - [ ] Nombre de vaisseaux du joueur
   - [ ] Stats cumulées (ships_destroyed, resources_collected, etc.)
   - [ ] Status actions : "Validées" / "Non validées" selon `round_actions_submitted`

---

### US 4.3 - Gestion erreurs & loading

**Critères d'acceptation** :
- [ ] Loading initial : spinner + "Chargement de la partie..."
- [ ] Erreur carte ou état : toast + bouton Retry
- [ ] Session supprimée pendant chargement : redirection LobbyHomeScreen

---

## 3. Détails Techniques

### GameContext (Context API + useReducer)
```typescript
interface GameState {
  map: GameMap | null;
  gameStatus: {
    round: number;
    resource: { ore: number };
    stats: PlayerStats;
    ships: Ship[];
    round_actions_submitted: boolean;
    status: 'running' | 'finished';
  } | null;
  loading: boolean;
  error: string | null;
}

type GameAction =
  | { type: 'SET_MAP'; payload: GameMap }
  | { type: 'SET_GAME_STATE'; payload: GameStatus }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
```

### Services
- `gameService.getGameMap(gameId)` -> GET /games/{gameId}/map
- `gameService.getGameState(gameId)` -> GET /games/{gameId}/state

### Hooks (récupération API)
- `useGame()` -> { map, gameStatus, loading, error, loadMap, loadState }

### API Endpoints
- `GET /games/{gameId}/map` -> Carte (une seule fois)
- `GET /games/{gameId}/state` -> État de la partie

---

## 4. Fichiers à Créer

```
src/features/game/
├── contexts/GameContext.tsx     (Context + Reducer + Provider)
├── services/gameService.ts
├── screens/
│   ├── GameScreen.tsx
│   └── GameOverScreen.tsx      (Sprint 6)
├── components/
│   ├── GameMap.tsx             (FlatList grille)
│   ├── MapCell.tsx             (cellule individuelle)
│   ├── ShipInfo.tsx            (Sprint 5)
│   └── PlayerStats.tsx
├── hooks/useGame.ts
├── types/game.types.ts
└── index.ts
```

---

## 5. Points d'Attention

- **Consigne** : "Il est très fortement recommandé d'utiliser uniquement un composant FlatList" pour la grille
- **Consigne** : "Ne vous lancez pas dans l'intégration d'une bibliothèque complexe de rendu 2D ou 3D"
- **Consigne** : "Pour des raisons de performances avec FlatList, n'affichez pas une image sur chaque case"
- **Consigne** : "Privilégiez un fond uni sous la grille pour apporter de la couleur"
- La carte est statique (un seul appel), l'état évolue à chaque tour
- Le coin supérieur gauche = position x:0, y:0
