# PRD - Épic 4 : Affichage de la Carte et État de la Partie

**Date** : 23 mars 2026  
**Version** : 1.0  
**Status** : À développer  
**Epic Estimate** : 13 points (3-4 jours)

---

## 1. Objectif Business

Afficher la carte du jeu et l'état actuel de la partie aux joueurs une fois que la partie a démarré.

**Success Metrics** :
- ✅ Carte du jeu affichée sous forme de grille lisible
- ✅ Nœuds de ressource visibles
- ✅ Vaisseaux des joueurs visibles à leur position
- ✅ État du joueur (minerai, round, stats) affichés
- ✅ Grille responsive sur différentes tailles d'appareil

---

## 2. User Stories

### US 4.1 - Affichage de la carte

**En tant que** joueur en jeu  
**Je veux** voir la carte du jeu avec tous les éléments  
**Afin de** comprendre la position de mes vaisseaux et des ressources

**Critères d'acceptation** :

1. **Interface GameScreen / MapScreen**
   - [ ] Affichage principal de la carte
   - [ ] Header : "Tour {round} - {session_name}"
   - [ ] Sous la carte : Panneau infos joueur (voir US 4.2)
   - [ ] Navigation bottom tabs (Game, Profile, etc.)

2. **Récupération données carte**
   - [ ] Appel API : GET /games/{gameId}/map (une seule fois au chargement)
   - [ ] Pas de polling pour la carte (données statiques)
   - [ ] Response : `{ width, height, resource_nodes: [{ x, y }, ...] }`
   - [ ] Stocké dans GameContext.map

3. **Rendu Grille**
   - [ ] Grille de `width x height` cellules
   - [ ] Chaque cellule a une taille responsive (adapté au size d'écran)
   - [ ] Fond léger (gris clair) ou avec pattern
   - [ ] Bordures subtiles entre cellules
   - [ ] Interaction : tap/press sur cellule (bonus : highlight)

4. **Affichage Ressources**
   - [ ] Pour chaque coordonnée dans `resource_nodes` :
     - Icône de ressource/minerai (ex : couleur dorée/jaune)
     - Centré dans la cellule
   - [ ] Label optionnel "Ore" ou simple couleur distinctive

5. **Affichage Vaisseaux**
   - [ ] Pour chaque vaisseau dans l'état du jeu :
     - Position : `{ x, y }`
     - Propriétaire : owner_id
     - Icône / symbole du vaisseau (ex : petit triangulaire, carré, etc.)
     - Couleur par joueur (chaque joueur = couleur unique)
     - Label optionnel : "J1", "J2", etc. (initiales des joueurs)
   - [ ] Vaisseaux visibles au-dessus des ressources (z-index)

6. **Mise à l'échelle et scroll**
   - [ ] Si grille > viewport : ScrollView avec scroll horizontal + vertical
   - [ ] OU : Zoom avec pinch-to-zoom (optionnel)
   - [ ] OU : Vue compactée avec offset possible (minimap style)

---

### US 4.2 - Affichage de l'état du joueur

**En tant que** joueur en jeu  
**Je veux** voir mon état actuel (ressources, tour, stats)  
**Afin de** vérifier ma progression et mes ressources

**Critères d'acceptation** :

1. **Interface PlayerStatus Panel**
   - [ ] Affichée sous la carte ou dans un onglet séparé
   - [ ] Contient les infos du joueur courant
   - [ ] Card ou section visuelle distincte

2. **Infos affichées**
   - [ ] **Tour actuel** : `round` (ex : "Tour 3/30")
   - [ ] **Minerai** : `resource.ore` (ex : "Minerai : 500")
   - [ ] **Nombre de vaisseaux** : count(ships) (ex : "Vaisseaux : 5")
   - [ ] **Stats cumulées** (read from `stats`)
     - `ships_destroyed` : Vaisseaux détruits
     - `resources_collected` : Ressources collectées
     - Autres stats du serveur
   - [ ] **Statut d'action** : `round_actions_submitted`
     - Si non soumis : "Actions non validées"
     - Si soumis : "Actions validées ✓"

3. **Appel API initial**
   - [ ] Appel GET /games/{gameId}/state au montage GameScreen
   - [ ] Response : `{ round, resource, stats, ships, round_actions_submitted, ... }`
   - [ ] Stocké dans GameContext.gameState & GameContext.ships

4. **Format & Design**
   - [ ] Layout : Grille 2x2 ou liste verticale
   - [ ] Icônes visuelles (minerai, vaisseaux, etc.)
   - [ ] Contraste bon pour la lisibilité
   - [ ] Police monospace pour nombres (optionnel)

---

### US 4.3 - Gestion d'erreur et loading

**En tant que** joueur  
**Je veux** que les erreurs soient gérées proprement  
**Afin de** ne pas être bloqué si quelque chose ne marche pas

**Critères d'acceptation** :

1. **States Visuels**
   - [ ] Loading initial : spinner fullscreen + "Chargement de la partie..."
   - [ ] Erreur carte : toast rouge + bouton "Retry"
   - [ ] Erreur état : toast rouge + bouton "Retry"
   - [ ] Offline : toast "Pas de connexion" + local state utilisé si possible

2. **Retry Logic**
   - [ ] Bouton retry relance les appels API
   - [ ] Max 3 tentatives avant message definition "Impossible de charger"
   - [ ] Logging des erreurs pour debug

3. **Edge Cases**
   - [ ] Session supprimée lors du chargement : redirection LobbyListScreen + toast
   - [ ] Joueur banni/kicked pendant jeu : redirection LobbyListScreen + toast
   - [ ] Timeout API : retry automatique après 5s

---

## 3. Acceptance Tests

| Test ID | Scenario | Expected | Pass/Fail |
|---------|----------|----------|-----------|
| T4.1.1 | Charger map : succès | Grille affichée | |
| T4.1.2 | Afficher ressources : OK | Icônes aux bonnes coords | |
| T4.1.3 | Afficher vaisseaux : OK | Icônes + couleurs joueur | |
| T4.1.4 | Map scroll : grille > viewport | Scroll horizontal/vertical | |
| T4.1.5 | Map zoom : pinch-to-zoom | Zoom in/out (optionnel) | |
| T4.2.1 | Afficher état joueur : OK | Toutes données visibles | |
| T4.2.2 | Tour display : correct | Round # affiché clairement | |
| T4.2.3 | Minerai display : correct | Ore count correct | |
| T4.2.4 | Stats display : correct | ships_destroyed, resources_collected | |
| T4.2.5 | Actions status : soumis | Badge/checkmark visible | |
| T4.2.6 | Actions status : non-soumis | "Non validées" visible | |
| T4.3.1 | Erreur map : retry | Bouton retry fonctionne | |
| T4.3.2 | Offline : fallback | Local state utilisé si possible | |
| T4.3.3 | Session supprimée : redirection | Vers LobbyListScreen | |

---

## 4. Technical Details

### Components
- **GameScreen.tsx** : Main screen, orchestrate sous-screens
- **GameMap.tsx** : Grille principale avec ressources & vaisseaux
- **MapCell.tsx** : Cellule individuelle (fond, ressource, vaisseau)
- **ResourceNode.tsx** : Affichage ressource
- **ShipIcon.tsx** : Affichage vaisseau avec couleur joueur
- **PlayerStats.tsx** : Panneau stats joueur
- **RoundInfo.tsx** : Affichage numéro du tour

### GameContext
```typescript
// State
{
  map: { width, height, resource_nodes: [...] } | null;
  gameState: {
    round: number;
    resource: { ore: number };
    stats: PlayerStats;
    ships: Ship[];
    round_actions_submitted: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
}

// Actions
- SET_MAP(map)
- SET_GAME_STATE(state)
- SET_LOADING(bool)
- SET_ERROR(error)
```

### Services
- **`gameService.getGameMap(gameId)`**
- **`gameService.getGameState(gameId)`**
- **`gameService.submitActions(gameId, actions)`** (bonus)

### Hooks
- **`useGame()`** : Return { map, gameState, isLoading, error, loadGame, refetchState }

### API Endpoints
- `GET /games/{gameId}/map` → Get game map
- `GET /games/{gameId}/state` → Get game state
- `POST /games/{gameId}/actions` → Submit actions (bonus)

---

## 5. Types TypeScript

```typescript
interface GameMap {
  width: number;
  height: number;
  resource_nodes: Array<{ x: number; y: number }>;
}

interface Ship {
  id: string;
  position: { x: number; y: number };
  owner_id: string;
  health: number;
  // ... autres propriétés
}

interface PlayerStats {
  ships_destroyed: number;
  resources_collected: number;
  kills: number;
  // ... autres stats
}

interface GameState {
  round: number;
  resource: { ore: number };
  stats: PlayerStats;
  ships: Ship[];
  round_actions_submitted: boolean;
  game_id: string;
  session_id: string;
}
```

---

## 6. UI/UX Guidelines

**Carte** :
- Grille claire avec bordures subtiles
- Ressources : couleur distinc (ex : jaune/doré)
- Vaisseaux : couleurs uniques par joueur
- Z-index : vaisseaux > ressources > fond grille
- Responsive : adapté aux petits écrans (scroll si besoin)

**Stats** :
- Layout clair et bien espacé
- Icônes visuelle pour chaque métrique
- Nombres lisibles (font assez grande)
- Positif : vert, négatif : rouge (optionnel)

**Feedback** :
- Loading spinners durant les appels
- Toast notifications pour erreurs
- Couleurs cohérentes avec design global

---

## 7. Définition de Done

- [ ] Code en TypeScript
- [ ] All acceptance tests pass
- [ ] Map affichée et lisible
- [ ] Stats joueur affichées correctement
- [ ] Scroll/zoom fonctionne si grille grande
- [ ] Error handling robuste
- [ ] Loading states clairs
- [ ] Responsive design testé
- [ ] Comments pertinents

---

## 8. Bonus Features (Hors Scope Étape 4)

Ces features sont optionnelles et peuvent être implémentées après l'étape 4 :

- [ ] **US 4.4 - Actions de tour** : Interface pour sélectionner actions du tour
- [ ] **US 4.5 - Résultats du tour** : Affichage des résultats après validation par tous
- [ ] **US 4.6 - Polling d'état** : Mise à jour en temps réel de l'état (toutes les N sec)
- [ ] **US 4.7 - Chat en jeu** (bonus) : Communication entre joueurs
- [ ] **US 4.8 - Replay de tour** (bonus) : Rejouer les mouvements du tour précédent

---

