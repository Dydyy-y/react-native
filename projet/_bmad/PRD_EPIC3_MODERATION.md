# PRD - Épic 3 : Modération et Démarrage de Partie

**Date** : 23 mars 2026  
**Version** : 1.0  
**Status** : À développer  
**Epic Estimate** : 13 points (3-4 jours)

---

## 1. Objectif Business

Donner au créateur de la session des outils pour modérer la salle d'attente (expulsion, bannissement, suppression) et lancer la partie quand tout est prêt.

**Success Metrics** :
- ✅ Créateur peut expulser un joueur (kick)
- ✅ Créateur peut bannir un joueur (ban)
- ✅ Créateur peut supprimer la session entière
- ✅ Créateur peut démarrer la partie
- ✅ Les joueurs non-créateur ne voient pas les boutons de modération
- ✅ La partie passe en état "running" après démarrage

---

## 2. User Stories

### US 3.1 - Actions de modération (Kick & Ban)

**En tant que** créateur de session  
**Je veux** pouvoir expulser ou bannir des joueurs du salon  
**Afin de** contrôler qui participe à ma partie

**Critères d'acceptation** :

1. **Interface ModerationPanel**
   - [ ] Affichée **SEULEMENT** si utilisateur = créateur de la session
   - [ ] Pour chaque joueur NON-créateur dans la liste :
     - Bouton "..." (menu contextuel) ou Bouton "Kick" + "Ban"
     - Ou : Swipe left avec actions (iOS) + long-press android
   - [ ] Boutons visuellement distincts (ex : icônes rouge/orange)

2. **Action KICK (Expulsion)**
   - [ ] Confirmation : "Êtes-vous sûr d'expulser {username} ?" [Annuler] [OK]
   - [ ] Appel API : POST /sessions/{id}/kick
   - [ ] Body : `{ player_id }`
   - [ ] Succès : joueur retiré de la liste, toast "Joueur expulsé"
   - [ ] Le joueur expulsé ne reçoit PAS de notification, mais n'a plus accès au salon
   - [ ] S'il rescanne le QR, il peut rejoindre à nouveau

3. **Action BAN (Bannissement)**
   - [ ] Confirmation : "Êtes-vous sûr de bannir {username} ? Il ne pourra plus rejoindre." [Annuler] [OK]
   - [ ] Appel API : POST /sessions/{id}/ban
   - [ ] Body : `{ player_id }`
   - [ ] Succès : joueur retiré de la liste, toast "Joueur banni"
   - [ ] Le joueur banni ne peut PAS rejoindre la session à nouveau (même en rescannant le QR)
   - [ ] Gestion côté API (le serveur vérifie la ban list)

4. **Gestion État & Polling**
   - [ ] Après kick/ban : LobbyContext.removePlayer(playerId)
   - [ ] Polling va aussi synchroniser si joueur parti de son côté
   - [ ] Liste mis à jour instantanément avec animation

---

### US 3.2 - Suppression de la session

**En tant que** créateur de session  
**Je veux** pouvoir supprimer la session complètement  
**Afin de** annuler la partie ou recommencer

**Critères d'acceptation** :

1. **Bouton "Supprimer la session"**
   - [ ] Visible SEULEMENT au créateur dans SessionDetailScreen
   - [ ] Bouton rouge/warning color (ex : #f44336)
   - [ ] OU dans le menu "..." en haut d'écran

2. **Confirmation Modale**
   - [ ] "Êtes-vous sûr de vouloir supprimer la session ? Personne ne pourra plus la rejoindre."
   - [ ] 2 boutons : [Annuler] [Supprimer]
   - [ ] Si utilisateur confirme : appel API DELETE /sessions/{id}

3. **Appel API** (DELETE /sessions/{id})
   - [ ] Response : `{ success: true }`
   - [ ] Succès :
     - Créateur : toast "Session supprimée" + redirection LobbyListScreen
     - Autres joueurs : reçoivent erreur lors du polling → toast "Session supprimée par le créateur" + redirection LobbyListScreen

4. **Gestion côté autres joueurs**
   - [ ] Le polling va retourner 404 ou erreur spécifique
   - [ ] Hook usePolling détecte et triggers unmount SessionDetailScreen
   - [ ] Redirection automatique LobbyListScreen

---

### US 3.3 - Démarrer la partie

**En tant que** créateur de session  
**Je veux** démarrer la partie quand tout le monde est prêt  
**Afin de** commencer le jeu

**Critères d'acceptation** :

1. **Bouton "Commencer la partie"**
   - [ ] Visible SEULEMENT au créateur dans SessionDetailScreen
   - [ ] Couleur primaire (ex : #2196F3 bleu)
   - [ ] **DISABLED** tant que < 2 joueurs (contrainte : min 2 joueurs)
   - [ ] Tooltip au survol : "Au moins 2 joueurs requis"

2. **Appel API** (POST /sessions/{id}/start)
   - [ ] Body : `{ }`
   - [ ] Response : `{ session: { id, state: "running", game_id }, ... }`
   - [ ] Service modifie le state de session de "waiting" → "running"

3. **Gestion état et redirection**
   - [ ] Créateur : toast "Partie démarrée" + redirection GameScreen
   - [ ] Autres joueurs : polling détecte state=running → redirection GameScreen
   - [ ] LobbyContext.session.state updated
   - [ ] Polling arrêté
   - [ ] GameContext initialisé

4. **Comportements post-démarrage**
   - [ ] Personne ne peut plus quitter la session
   - [ ] Les actions de modération sont désactivées (boutons pas affichés)
   - [ ] Les joueurs doivent prendre les décisions directement en jeu

---

## 3. Acceptance Tests

| Test ID | Scenario | Expected | Pass/Fail |
|---------|----------|----------|-----------|
| T3.1.1 | Kick joueur : confirmé | Joueur retiré, toast | |
| T3.1.2 | Kick joueur : cancelled | Joueur reste, pas d'appel API | |
| T3.1.3 | Kick joueur : joueur peut rejoindre après | Oui, rescanner QR | |
| T3.1.4 | Ban joueur : confirmé | Joueur retiré, banni | |
| T3.1.5 | Ban joueur : joueur ne peut rejoindre | Non, même avec QR | |
| T3.1.6 | Player non-créateur : pas de boutons | Buttons invisibles | |
| T3.2.1 | Supprimer session : créateur | Redirection + toast | |
| T3.2.2 | Supprimer session : autres joueurs | Auto-redirection + toast | |
| T3.2.3 | Supprimer confirmé : session inexistante | API error handled | |
| T3.3.1 | Commencer partie : < 2 joueurs | Button disabled, tooltip | |
| T3.3.2 | Commencer partie : ≥ 2 joueurs | Button enabled | |
| T3.3.3 | Commencer partie : créateur | Redirect GameScreen | |
| T3.3.4 | Commencer partie : autres joueurs | Polling détecte, redirect GameScreen | |
| T3.3.5 | Post-start : kick désactivé | Boutons invisibles | |

---

## 4. Technical Details

### UI Components
- **ModerationPanel.tsx**
  - Props : `{ session, players, isCreator }`
  - Children : Boutons kick/ban pour chaque non-créateur
  
- **PlayerListItem.tsx**
  - Props : `{ player, isCreator, onKick, onBan }`
  - Affiche : nom, badge créateur, (actions si creator)

- **DeleteSessionModal.tsx**
  - Props : `{ visible, onConfirm, onCancel }`
  
- **StartGameButton.tsx**
  - Props : `{ disabled, onPress }`
  - État : enabled/disabled avec tooltip

### Services
- **`sessionService.kickPlayer(sessionId, playerId)`**
- **`sessionService.banPlayer(sessionId, playerId)`**
- **`sessionService.deleteSession(sessionId)`**
- **`sessionService.startGame(sessionId)`**

### API Endpoints
- `POST /sessions/{id}/kick` → Kick player
- `POST /sessions/{id}/ban` → Ban player
- `DELETE /sessions/{id}` → Delete session
- `POST /sessions/{id}/start` → Start game

### State Management
```typescript
// LobbyContext.setSession({ ...session, state: "running" })
// Triggers polling stop
// Triggers GameContext initialization
```

---

## 5. Error Handling

- **Erreur kick/ban** : Toast + retry button
- **Erreur delete** : Toast + retry button
- **Erreur start** : Toast "Impossible de démarrer la partie", button remain enabled
- **Timeout** : Toast "Serveur indisponible" + retry
- **Unauthorized (créateur kick enlevé)** : Logout + LoginScreen

---

## 6. UI/UX Guidelines

- Confirmation modales pour toutes les actions destructives
- Icons visuels pour kick (person-x) et ban (ban-circle)
- Loading spinners durant les appels API
- Animations fluides lors des retraits de joueurs
- Tooltips explicatifs
- Couleurs distinctes :
  - Kick : Orange/warning
  - Ban : Red/error
  - Start : Blue/primary
  - Delete : Red/error

---

## 7. Définition de Done

- [ ] Code en TypeScript
- [ ] All acceptance tests pass
- [ ] ModerationPanel composant réutilisable
- [ ] Confirmations pour actions destructives
- [ ] Error handling robuste
- [ ] Navigation automatique détectée
- [ ] Comments pertinents

---

