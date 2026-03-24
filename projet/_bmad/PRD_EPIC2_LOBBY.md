# PRD - Épic 2 : Création et Gestion du Salon (Lobby)

**Date** : 23 mars 2026  
**Version** : 1.0  
**Status** : À développer  
**Epic Estimate** : 21 points (5-6 jours)

---

## 1. Objectif Business

Permettre aux joueurs de créer une nouvelle session de jeu, de rejoindre une session existante via QR Code, et de gérer l'état du salon avant le démarrage de la partie.

**Success Metrics** :
- ✅ Utilisateurs capable de créer une session de jeu
- ✅ QR Code généré et lisible
- ✅ Utilisateurs peuvent rejoindre une session en scannant le QR Code
- ✅ Liste des joueurs dans le salon mise à jour en temps réel via polling
- ✅ Utilisateurs peuvent quitter le salon tant que la partie n'a pas démarré

---

## 2. User Stories

### US 2.1 - Créer une session de jeu

**En tant que** joueur  
**Je veux** créer une nouvelle session de jeu et inviter d'autres joueurs  
**Afin de** lancer une partie avec mes amis

**Critères d'acceptation** :

1. **Interface CreateSessionScreen**
   - [ ] Page accessible depuis LobbyListScreen
   - [ ] Input session name : Placeholder "Nom de la partie" (optionnel, défaut : "Session de {username}")
   - [ ] Input max players : Dropdown [2, 3, 4] (défaut : 4)
   - [ ] Button "Créer la session"
   - [ ] Button "Annuler" (back to LobbyListScreen)

2. **Appel API** (POST /sessions)
   - [ ] Body : `{ name, max_players }`
   - [ ] Response : `{ session: { id, name, creator_id, state, qr_code_data }, ... }`
   - [ ] En cas d'erreur : afficher toast avec message erreur

3. **Affichage QR Code**
   - [ ] Une fois session créée : afficher QRDisplayComponent
   - [ ] QR Code contient : session ID ou invitation code
   - [ ] Bouton "Copier le code" (copie vers clipboard)
   - [ ] Bouton "Partager" (share intent - optionnel)
   - [ ] Message : "Invitez vos amis à scaner ce QR Code"
   - [ ] Redirection automatique vers SessionDetailScreen avec polling

4. **Gestion State**
   - [ ] Session stockée dans LobbyContext
   - [ ] Loading state pendant création
   - [ ] Erreur : toast rouge, stay on CreateSessionScreen

---

### US 2.2 - Rejoindre une session

**En tant que** joueur  
**Je veux** rejoindre une session existante en scannant un QR Code  
**Afin de** jouer avec d'autres joueurs

**Critères d'acceptation** :

1. **Interface JoinSessionScreen**
   - [ ] Page accessible depuis LobbyListScreen avec bouton "Rejoindre une session"
   - [ ] 2 options affichées :
     - Option A : Bouton "Scanner QR Code"
     - Option B : Input manuel du code d'invitation
   - [ ] Bouton "Annuler" (back to LobbyListScreen)

2. **QR Scanner**
   - [ ] Utiliser `expo-camera` + `expo-barcode-scanner`
   - [ ] Permission demandée à l'utilisateur
   - [ ] Preview caméra affichée
   - [ ] Une fois QR scanné : extraire session code/ID
   - [ ] Appel API automatique POST /sessions/{id}/join

3. **Input manuel**
   - [ ] Input code : Placeholder "Entrez le code d'invitation"
   - [ ] Button "Rejoindre"
   - [ ] Même appel API PUT /sessions/{code}/join

4. **Appel API** (POST /sessions/{id}/join)
   - [ ] Body : `{ }`
   - [ ] Response : `{ session: { id, name, players, ... } }`
   - [ ] En cas d'erreur : afficher toast (session pleine, session inexistante, déjà membre, etc.)

5. **Gestion State**
   - [ ] Session stockée dans LobbyContext
   - [ ] Redirection automatique vers SessionDetailScreen si succès
   - [ ] Erreur : toast rouge, stay on JoinSessionScreen

---

### US 2.3 - Affichage du salon en temps réel

**En tant que** joueur dans un salon  
**Je veux** voir la liste des joueurs présents mise à jour automatiquement  
**Afin de** vérifier que tout le monde est connecté avant le démarrage

**Critères d'acceptation** :

1. **Interface SessionDetailScreen**
   - [ ] Display :
     - Header : "Salon : {session_name}"
     - Session info : "Créateur : {creator_name}", "{players_count}/4 joueurs"
     - List composant : affiche tous les joueurs
       - Pour chaque joueur : nom, statut (créateur badge)
     - Button section du bas (voir US 2.4, 3.x)
   - [ ] Refresh indicator (pull-to-refresh optionnel)

2. **Polling HTTP**
   - [ ] Appel GET /sessions/{id} toutes les 30 secondes (contrainte API : 20 req/min)
   - [ ] Déclenché au mount de SessionDetailScreen
   - [ ] Arrêté au unmount ou quand utilisateur quitte
   - [ ] Arêté si session état = "running" → redirection GameScreen
   - [ ] Arrêté si session supprimée ou utilisateur banni → redirection LobbyListScreen

3. **Gestion des mises à jour**
   - [ ] Comparer ancienne liste vs nouvelle liste
   - [ ] Si nouveau joueur : animation slide-in
   - [ ] Si joueur parti : animation fade-out + remove
   - [ ] Si liste identique : pas de re-render inutile
   - [ ] LobbyContext.setPlayers(newPlayers) ou updatePlayer()

4. **Gestion des erreurs de polling**
   - [ ] Erreur réseau : afficher toast "Impossible de synchroniser", retry après 30s
   - [ ] 401 : logout (token expiré) + redirection LoginScreen
   - [ ] 403 : afficher toast "Session supprimée" + redirection LobbyListScreen
   - [ ] 404 : session inexistante → redirection LobbyListScreen

---

### US 2.4 - Quitter le salon

**En tant que** joueur dans un salon qui n'a pas démarré  
**Je veux** pouvoir quitter le salon facilement  
**Afin de** chercher une autre session

**Critères d'acceptation** :

1. **Button "Quitter"**
   - [ ] Visible dans SessionDetailScreen si state === "waiting"
   - [ ] **DISABLED** si utilisateur est le créateur
   - [ ] Appel API DELETE /sessions/{id}/leave

2. **Confirmation Modale**
   - [ ] Modale "Êtes-vous sûr de vouloir quitter ?" avec 2 boutons
   - [ ] Cancel : ferme modale
   - [ ] Confirm : appel API

3. **Appel API** (DELETE /sessions/{id}/leave)
   - [ ] Response : `{ success: true }`
   - [ ] Succès : dispatch LobbyContext.clearSession() + redirection LobbyListScreen
   - [ ] Erreur : toast "Impossible de quitter", retry

4. **Gestion State**
   - [ ] Loading pendant suppression
   - [ ] Polling arrêté
   - [ ] LobbyContext cleared

---

## 3. Acceptance Tests

| Test ID | Scenario | Expected | Pass/Fail |
|---------|----------|----------|-----------|
| T2.1.1 | Créer session : succès | QR displayed, redirect SessionDetail | |
| T2.1.2 | Créer session : erreur API | Toast erreur, stay on CreateSession | |
| T2.2.1 | Scanner QR : valide | Join session, redirect SessionDetail | |
| T2.2.2 | Scanner QR : invalide | Toast erreur, stay on JoinSession | |
| T2.2.3 | Rejoindre session : already member | Toast erreur | |
| T2.2.4 | Rejoindre session : full | Toast "Session complète" | |
| T2.3.1 | Polling : nouveau joueur | List updated, animation | |
| T2.3.2 | Polling : joueur parti | List updated, animation | |
| T2.3.3 | Polling : session supprimée | Redirect LobbyList + toast | |
| T2.3.4 | Polling : utilisateur banni | Redirect LobbyList + toast | |
| T2.4.1 | Quitter salon : succès | Redirect LobbyList | |
| T2.4.2 | Quitter salon : créateur disabled | Button grayed out | |

---

## 4. Technical Details

### LobbyContext
```typescript
// State
{
  session: GameSession | null;
  players: Player[];
  isLoading: boolean;
  error: string | null;
  pollingActive: boolean;
}

// Actions
- SET_SESSION(session: GameSession)
- SET_PLAYERS(players: Player[])
- UPDATE_PLAYER(player: Player)
- REMOVE_PLAYER(playerId: string)
- SET_POLLING_ACTIVE(bool)
- CLEAR_SESSION()
```

### Services
- **`sessionService.createSession(name, maxPlayers)`**
- **`sessionService.joinSession(sessionId)`**
- **`sessionService.leaveSession(sessionId)`**
- **`lobbyService.getSessionInfo(sessionId)`**
- **`qrService.generateQR(sessionId)`**
- **`qrService.parseQR(qrData)`**

### Hooks
- **`useLobby()`** : Return { session, players, isLoading, error, createSession, joinSession, leaveSession }
- **`usePolling(url, interval, condition)`** : Polling hook réutilisable

### API Endpoints
- `POST /sessions` → Create session
- `GET /sessions/{id}` → Get session info
- `POST /sessions/{id}/join` → Join session
- `DELETE /sessions/{id}/leave` → Leave session

---

## 5. Polling Implementation Strategy

```typescript
// Hook usePolling
export const usePolling = (
  fetchFn: () => Promise<any>,
  interval: number = 30000,
  active: boolean = true,
  onDataUpdate?: (data: any) => void,
  onError?: (error: Error) => void
) => {
  useEffect(() => {
    if (!active) return;
    
    const timerId = setInterval(async () => {
      try {
        const data = await fetchFn();
        onDataUpdate?.(data);
      } catch (error) {
        onError?.(error);
      }
    }, interval);
    
    return () => clearInterval(timerId);
  }, [active, interval, fetchFn, onDataUpdate, onError]);
};

// Usage in SessionDetailScreen
usePolling(
  () => lobbyService.getSessionInfo(session.id),
  30000,
  true, // active only if on screen
  (data) => {
    dispatch({ type: 'SET_SESSION', payload: data.session });
    dispatch({ type: 'SET_PLAYERS', payload: data.players });
  },
  (error) => {
    // Handle polling error
  }
);
```

---

## 6. UI/UX Guidelines

- Smooth transitions/animations lors des updates de liste
- Loading skeleton pour session info
- Clear error messages (session pleine, inexistante, etc.)
- QR code bien défini et lisible
- Countdown ou warning si session va être supprimée

---

## 7. Définition de Done

- [ ] Code en TypeScript
- [ ] All acceptance tests pass
- [ ] Polling implémenté et testé (rate limit respecté)
- [ ] QR Code généré et scannability testée
- [ ] Navigation fluide entre écrans
- [ ] Error handling robuste
- [ ] Comments pertinents

---

