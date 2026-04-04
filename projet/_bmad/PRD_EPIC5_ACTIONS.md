# PRD - Étape 5 : Actions de Jeu

**Date** : 04 avril 2026  
**Version** : 1.0  
**Status** : A développer  
**Sprint** : 5

---

## 1. Objectif

Permettre aux joueurs d'effectuer des actions pendant leur tour (déplacer, attaquer, acheter) et d'inspecter les éléments sur la carte. Gérer le cycle des tours via polling.

**Critères de succès** :
- Cases pressables pour inspecter les vaisseaux
- Joueurs peuvent déplacer et attaquer avec leurs vaisseaux
- Joueurs peuvent acheter de nouveaux vaisseaux
- Validation du tour + gestion erreurs serveur
- Polling d'état après validation pour détecter le tour suivant

---

## 2. User Stories

### US 5.1 - Inspection des vaisseaux

**En tant que** joueur en jeu  
**Je veux** presser une case pour voir les infos du vaisseau  
**Afin de** connaître ses caractéristiques

**Critères d'acceptation** :
- [ ] Cases pressables (tap sur MapCell)
- [ ] Si vaisseau présent : afficher ses infos (type, HP, attaque, portée, propriétaire)
- [ ] Affichage via modal ou panneau d'info
- [ ] Si case vide ou ressource seule : pas d'action ou info ressource

---

### US 5.2 - Actions move & attack

**En tant que** joueur  
**Je veux** déplacer mes vaisseaux et attaquer les ennemis  
**Afin de** conquérir le territoire

**Critères d'acceptation** :

1. **Sélection vaisseau**
   - [ ] Tap sur un vaisseau du joueur : le sélectionne (highlight visuel)
   - [ ] Afficher les actions disponibles pour ce vaisseau

2. **Move (déplacement)**
   - [ ] Afficher les cases à portée de déplacement du vaisseau
   - [ ] Tap sur case cible -> ajouter action `{ type: "move", ship_id, target_x, target_y }`
   - [ ] Consigne : 1 seule action par vaisseau par tour
   - [ ] Consigne : plusieurs vaisseaux du même joueur ne peuvent pas se déplacer sur la même case

3. **Attack (attaque)**
   - [ ] Afficher les cases à portée d'attaque
   - [ ] Tap sur case cible avec vaisseau ennemi -> ajouter action `{ type: "attack", ship_id, target_x, target_y }`

4. **Validation du tour**
   - [ ] Bouton "Valider mes actions"
   - [ ] POST /games/{gameId}/actions avec body `{ actions: [...] }`
   - [ ] Si erreur de validation serveur : afficher l'erreur, permettre correction et renvoi de TOUTES les actions
   - [ ] Succès : `round_actions_submitted = true`

---

### US 5.3 - Achat de vaisseaux

**En tant que** joueur  
**Je veux** acheter de nouveaux vaisseaux  
**Afin de** renforcer ma flotte

**Critères d'acceptation** :
- [ ] Interface listant les types de vaisseaux disponibles avec caractéristiques (HP, attaque, portées, gathering_rate, coût)
- [ ] Bouton "Acheter" pour chaque type (disabled si minerai insuffisant)
- [ ] Après achat : sélectionner case de déploiement
- [ ] Consigne : case libre ou case ressource, PAS sur un vaisseau existant
- [ ] Action ajoutée : `{ type: "purchase", ship_type_id, target_x, target_y }`
- [ ] Le coût est déduit après validation côté serveur

---

### US 5.4 - Attente entre tours & polling

**En tant que** joueur ayant validé ses actions  
**Je veux** attendre les autres joueurs et voir la mise à jour  
**Afin de** continuer la partie au tour suivant

**Critères d'acceptation** :
- [ ] Après validation : afficher visuel d'attente ("En attente des autres joueurs...")
- [ ] Le joueur peut consulter la carte mais NE PEUT PLUS agir
- [ ] Polling GET /games/{gameId}/state toutes les 30 secondes
- [ ] Quand `round_actions_submitted` revient à `false` : nouveau tour commence
- [ ] Mettre à jour toute l'interface (positions vaisseaux, ressources, round, ore)
- [ ] GameContext : `dispatch({ type: 'SET_GAME_STATE', payload: newState })`

---

## 3. Détails Techniques

### Services (compléter gameService.ts)
- `gameService.submitActions(gameId, actions)` -> POST /games/{gameId}/actions
- `gameService.getShipTypes(gameId)` -> endpoint types de vaisseaux (vérifier doc API)
- `gameService.getGameState(gameId)` -> GET /games/{gameId}/state (polling)

### Structure d'une action
```typescript
type GameAction =
  | { type: 'move'; ship_id: number; target_x: number; target_y: number }
  | { type: 'attack'; ship_id: number; target_x: number; target_y: number }
  | { type: 'purchase'; ship_type_id: number; target_x: number; target_y: number };
```

### Polling
- Réutilise le hook `usePolling` de `shared/hooks/usePolling.ts`
- Activé uniquement quand `round_actions_submitted === true`
- Désactivé quand le nouveau tour commence

### API Endpoints (vérifier doc officielle)
- `POST /games/{gameId}/actions` -> Submit turn actions
- `GET /games/{gameId}/state` -> Get game state (polling)
- Endpoint ship types (vérifier dans doc API)

---

## 4. Fichiers à Créer

```
src/features/game/components/
├── ShipInfo.tsx           (modal/panneau info vaisseau)
├── ActionPanel.tsx        (panneau actions move/attack)
└── ShipShop.tsx           (liste types vaisseaux + achat)
```

---

## 5. Points d'Attention

- **Consigne** : "Il n'est possible d'effectuer qu'une seule action par tour pour chaque vaisseau"
- **Consigne** : "Plusieurs vaisseaux d'un même joueur ne peuvent se déplacer sur la même case pendant un même tour"
- **Consigne** : "Si une des actions envoyées est impossible, le serveur retournera une erreur. Il sera nécessaire de corriger le problème et renvoyer une nouvelle requête avec l'ensemble des actions"
- **Consigne** : "Un vaisseau acheté peut être déployé sur une case libre ou sur une case contenant une ressource. Il ne peut pas être déployé sur une case contenant un autre vaisseau"
- Le gain de minerai est automatique via les miners sur les resource_nodes
- Les règles de portée sont vérifiées côté serveur, mais il faut masquer les options invalides côté UI
