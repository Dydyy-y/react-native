# PRD - Étape 3 : Modération du Salon et Démarrage de la Partie

**Date** : 23 mars 2026 (mis à jour 04 avril 2026)  
**Version** : 2.0  
**Status** : A développer  
**Sprint** : 3

---

## 1. Objectif

Donner au créateur de la session des outils pour modérer la salle d'attente (expulsion, bannissement, suppression) et lancer la partie quand tout est prêt.

**Critères de succès** :
- Créateur peut expulser un joueur (kick) — le joueur peut rejoindre à nouveau
- Créateur peut bannir un joueur (ban) — le joueur ne peut PAS rejoindre à nouveau
- Créateur peut supprimer la session — tous les joueurs sont redirigés
- Créateur peut démarrer la partie — tous les joueurs passent en mode jeu
- Les joueurs non-créateur ne voient PAS les boutons de modération

---

## 2. User Stories

### US 3.1 - Actions de modération (Kick & Ban)

**En tant que** créateur de session  
**Je veux** pouvoir expulser ou bannir des joueurs  
**Afin de** contrôler qui participe à ma partie

**Critères d'acceptation** :

1. **Interface**
   - [ ] Boutons kick/ban affichés SEULEMENT si utilisateur === créateur
   - [ ] Pour chaque joueur NON-créateur : actions visibles
   - [ ] Confirmation modale avant chaque action destructive

2. **Kick (Expulsion)**
   - [ ] Appel API endpoint kick (vérifier doc API)
   - [ ] Joueur retiré de la liste côté créateur
   - [ ] Joueur expulsé : n'a plus accès à la session, redirigé au prochain polling (pas de notification spécifique)
   - [ ] Le joueur kické peut rejoindre à nouveau en rescannant le QR

3. **Ban (Bannissement)**
   - [ ] Appel API endpoint ban (vérifier doc API)
   - [ ] Joueur retiré de la liste côté créateur
   - [ ] Joueur banni : redirigé au prochain polling, ne peut PAS rejoindre même en rescannant
   - [ ] Le serveur vérifie la ban list côté API

4. **State (Context API + useReducer)**
   - [ ] LobbyContext : `SET_SESSION` avec les nouvelles données après kick/ban
   - [ ] Le polling synchronise aussi côté joueur expulsé/banni

---

### US 3.2 - Suppression de la session

**En tant que** créateur de session  
**Je veux** pouvoir supprimer la session  
**Afin d'** annuler la partie

**Critères d'acceptation** :

1. **Bouton "Supprimer la session"**
   - [ ] Visible SEULEMENT au créateur
   - [ ] Confirmation modale : "Êtes-vous sûr ?"

2. **Appel API** (DELETE /sessions/{id})
   - [ ] Créateur : toast "Session supprimée" + redirection LobbyHomeScreen
   - [ ] Autres joueurs : polling retourne erreur/404 -> toast "Session supprimée par le créateur" + redirection LobbyHomeScreen

---

### US 3.3 - Démarrer la partie

**En tant que** créateur de session  
**Je veux** démarrer la partie quand tout le monde est prêt  
**Afin de** commencer le jeu

**Critères d'acceptation** :

1. **Bouton "Commencer la partie"**
   - [ ] Visible SEULEMENT au créateur
   - [ ] DISABLED si < 2 joueurs dans la session
   - [ ] Appel API POST /sessions/{id}/start

2. **Redirection et state**
   - [ ] Session passe en state "running"
   - [ ] Créateur : redirection vers GameScreen
   - [ ] Autres joueurs : polling détecte state === "running" -> redirection GameScreen
   - [ ] Polling lobby arrêté

3. **Comportements post-démarrage**
   - [ ] Plus personne ne peut quitter la session
   - [ ] Les boutons de modération sont cachés
   - [ ] GameContext initialisé avec le game_id reçu

---

## 3. Détails Techniques

### Services (compléter sessionService.ts)
- `sessionService.kickPlayer(sessionId, playerId)` -> endpoint kick (vérifier doc API)
- `sessionService.banPlayer(sessionId, playerId)` -> endpoint ban (vérifier doc API)
- `sessionService.deleteSession(sessionId)` -> DELETE /sessions/{id}
- `sessionService.startGame(sessionId)` -> POST /sessions/{id}/start

### Logique créateur
```typescript
const isCreator = session.creator_id === currentUser.id;
// Afficher les boutons modération/start seulement si isCreator
```

### API Endpoints (vérifier doc officielle)
- Endpoint kick
- Endpoint ban
- `DELETE /sessions/{id}` -> Delete session
- `POST /sessions/{id}/start` -> Start game

---

## 4. Points d'Attention

- **Consigne** : "Seul le créateur a accès aux fonctionnalités de modération et de démarrage"
- **Consigne** : "Après le démarrage, les joueurs ne peuvent plus quitter et la modération n'est plus possible"
- **Consigne** : "Le joueur expulsé ne sera pas notifié" — la redirection se fait via le polling qui détecte l'absence
- **Consigne** : "Le joueur banni ne sera pas notifié" — idem
- Les vérifications sont faites côté serveur, mais les boutons doivent être cachés côté UI
