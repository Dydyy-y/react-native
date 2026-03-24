# Sprint Planning & Roadmap

**Date** : 24 mars 2026  
**Durée Totale** : 4 semaines (jusqu'au 07 avril 2026)  
**Équipe** : Individuel (Mathys)  
**Status** : Sprint 1 - À démarrer

**Temps Total Estimé** : 22-26 heures de développement  
**Approche** : Agile + Zustand + Feature-Folder + TypeScript

---

## 📋 Table des Matières

1. [Vue d'ensemble & Timeline](#vue-densemble--timeline)
2. [Sprint 1: Authentification (EPIC 1)](#sprint-1-authentification-epic-1)
3. [Sprint 2: Lobby & QR Code (EPIC 2)](#sprint-2-lobby--qr-code-epic-2)
4. [Sprint 3: Modération & Start (EPIC 3)](#sprint-3-modération--start-epic-3)
5. [Sprint 4: Game Map & État (EPIC 4)](#sprint-4-game-map--état-epic-4)
6. [Dépendances & Risques Globaux](#dépendances--risques-globaux)
7. [Backlog Bonus](#backlog-bonus)

---

## Vue d'ensemble & Timeline

### Chronologie Générale

```
Jour 1   (8h)   : Sprint 1 - EPIC 1 (Auth)          ✅ Base critique
Jour 2-3 (13h)  : Sprint 2 - EPIC 2 (Lobby)         ✅ Gestion sessions
Jour 4   (8h)   : Sprint 3 - EPIC 3 (Modération)    ✅ Contrôles créateur
Jour 5   (8h)   : Sprint 4 - EPIC 4 (Game)          ✅ Affichage partie
─────────────────────────────────────────────────────────────
TOTAL    (27h)  : Tous épics complets + buff testing
```

### Métriques par Sprint

| Sprint | Épic | Points | Heures | Jours | Dépend de | Status |
|--------|------|--------|--------|-------|-----------|--------|
| 1 | Auth | 13 | 6-8h | 1 jour | RIEN | 🟡 À démarrer |
| 2 | Lobby | 21 | 10-13h | 2.5 jours | Sprint 1 | 🟡 À démarrer |
| 3 | Modération | 13 | 6-8h | 1 jour | Sprint 2 | 🟡 À démarrer |
| 4 | Game | 13 | 6-8h | 1 jour | Sprint 3 | 🟡 À démarrer |

---

## Sprint 1: Authentification (EPIC 1)

**⏱️ Durée** : 6-8 heures (1 jour complet)  
**📍 Dépendances** : Aucune (point de départ)  
**🎯 Objectif** : Permettre s'inscrire / connecter et gérer tokens sécurisément  
**✅ Blockers** : Aucun

### User Stories Détaillées

#### US 1.1 : Créer un compte (Sign Up) - 5 points

**Description** : Nouveau joueur crée un compte avec email & password

**Critères d'acceptation détaillés** :

1. **SignUpScreen - Interface (1.5h)**
   - [ ] Title : "Créer un compte"
   - [ ] Input `username` : placeholder "Nom d'utilisateur", alphanumériques + underscore
   - [ ] Input `email` : placeholder "Email"
   - [ ] Input `password` : masked, placeholder "Mot de passe (min 8)"
   - [ ] Input `confirmPassword` : masked, placeholder "Confirmer mot de passe"
   - [ ] Button "S'inscrire" : disabled si form invalide
   - [ ] Link "Vous avez déjà un compte ? Se connecter" → LoginScreen
   - [ ] Error display sous chaque champ (rouge)
   - [ ] Loading spinner pendant requête

2. **Validations côté client (0.5h)**
   - [ ] Username : 3-20 caractères, regex `/^[a-zA-Z0-9_]+$/`
   - [ ] Email : format email valide, regex email standard
   - [ ] Password : min 8 caractères, afficher force indicator (optionnel)
   - [ ] confirmPassword === password
   - [ ] Erreurs affichées en TEMPS RÉEL (onChange)
   - [ ] Cas: champs vides, format invalide, mismatch password

3. **Appel API & Storage (1h)**
   - [ ] POST `https://api.../auth/register` avec body `{ username, email, password }`
   - [ ] Response: `{ user: { id, username, email }, access_token, token_type, expires_in }`
   - [ ] Token sauvegardé dans `expo-secure-store` sous clé `auth_token`
   - [ ] User object sauvegardé dans AuthStore (Zustand)
   - [ ] En cas erreur : afficher toast API error message (ex: "Email déjà utilisé")

4. **State Management (1h)**
   - [ ] AuthStore: `setUser()`, `setToken()`, `setLoading()`, `setError()`
   - [ ] Loading state: spinner visible, button disabled
   - [ ] Success: redirection automatique vers AppTabs (ou LoginScreen si no auto-login)
   - [ ] Error: toast rouge, pas de redirection, focus input problématique

**Tâches Techniques**:
- [ ] Créer `src/features/auth/stores/authStore.ts` (Zustand)
- [ ] Créer `src/features/auth/services/authService.ts` (axios calls)
- [ ] Créer `src/features/auth/screens/SignUpScreen.tsx`
- [ ] Créer `src/features/auth/components/InputField.tsx` (réutilisable)
- [ ] Créer `src/features/auth/types/index.ts` (interfaces User, Auth)
- [ ] Setup `expo-secure-store` import & export wrapper
- [ ] Test: créer compte valide → token en secure storage

**Definition of Done**:
- ✅ SignUpScreen fonctionne end-to-end
- ✅ Token secure stocké et retrievable
- ✅ Validations côté client complètes
- ✅ Gestion erreurs API (affichage toast)
- ✅ TypeScript types strict

---

#### US 1.2 : S'authentifier (Sign In) - 5 points

**Description** : Joueur existant se connecte et son token est utilisé automatiquement

**Critères d'acceptation détaillés** :

1. **LoginScreen - Interface (1.5h)**
   - [ ] Title : "Se connecter"
   - [ ] Input `emailOrUsername` : placeholder "Email ou nom d'utilisateur"
   - [ ] Input `password` : masked, placeholder "Mot de passe"
   - [ ] Checkbox "Se souvenir de moi" (optionnel v1)
   - [ ] Button "Se connecter" : disabled si form invalide
   - [ ] Link "Pas encore inscrit ? Créer un compte" → SignUpScreen
   - [ ] [BONUS] Link "Mot de passe oublié ?" (à ignorer v1)
   - [ ] Error display sous champs (rouge)
   - [ ] Loading spinner pendant requête

2. **Validations côté client (0.5h)**
   - [ ] Email/username : non-vide
   - [ ] Password : non-vide, min 8 affichés
   - [ ] Erreurs affichées en TEMPS RÉEL

3. **Appel API & Persistent Storage (1.5h)**
   - [ ] POST `https://api.../auth/login` avec body `{ email_or_username, password }`
   - [ ] Response: `{ user: { id, username, email }, access_token, token_type, expires_in }`
   - [ ] Token sauvegardé dans `expo-secure-store` sous clé `auth_token`
   - [ ] User stocké dans AuthStore
   - [ ] Header Authorization automatiquement ajouté par interceptor Axios
   - [ ] Erreur: afficher toast "Email/password invalides" (spécifique)

4. **State Management & Navigation (1h)**
   - [ ] Loading state: spinner visible, button disabled
   - [ ] Success: redirection AppTabs (Lobby screen)
   - [ ] Error: toast, state reset, focus input
   - [ ] AuthStore.setUser() & setToken()

**Tâches Techniques**:
- [ ] Créer `src/features/auth/screens/LoginScreen.tsx`
- [ ] Créer `src/shared/api/apiClient.ts` (Axios + interceptors)
- [ ] Configurer Authorization interceptor (Bearer token)
- [ ] Créer `src/shared/hooks/useAuth.ts` (selector hook optionnel)
- [ ] Test: login valide → token utilisé dans requêtes suivantes

**Definition of Done**:
- ✅ LoginScreen fonctionne end-to-end
- ✅ Token ajouté automatiquement aux requests (interceptor)
- ✅ Validations côté client
- ✅ Gestion erreurs API
- ✅ Navigation automatique post-login

---

#### US 1.3 : Navigation Protégée & Token Management - 3 points

**Description** : App protégée, utilisateurs non-connectés ne peuvent pas accéder au contenu

**Critères d'acceptation détaillés** :

1. **RootNavigator Logic (1h)**
   - [ ] State: `isLoading` (vérifier token au démarrage)
   - [ ] Si `isLoading=true` → afficher SplashScreen (spinner + branding)
   - [ ] Si `isLoading=false && !user` → AuthStack (LoginScreen/SignUpScreen)
   - [ ] Si `isLoading=false && user` → AppTabs (Lobby, Game, etc.)

2. **App Startup Verification (1h)**
   - [ ] useEffect au montage App
   - [ ] Vérifier existance token dans `expo-secure-store`
   - [ ] Si token existe: appel GET `/api/auth/me` pour valider
   - [ ] Si valide: charger user, AuthStore.setUser() + continue
   - [ ] Si invalide/401: supprimer token, redirection LoginScreen
   - [ ] Si offline: timeout 5s, afficher toast, allow try again

3. **Logout / Déconnexion (1h)**
   - [ ] Button logout dans Settings/Profile screen
   - [ ] Confirmation modale: "Êtes-vous sûr de vous déconnecter ?"
   - [ ] Action: supprimer token secure storage + AuthStore.logout() + RootNavigator refresh
   - [ ] Redirection automatique LoginScreen

4. **Token Interceptor & 401 Handling (1h)**
   - [ ] Axios interceptor: ajouter `Authorization: Bearer ${token}` si existe
   - [ ] Gestion réponse 401 (token expiré): auto-logout + LoginScreen
   - [ ] Gestion réponse 403: afficher toast "Accès refusé"
   - [ ] Gestion timeout (offline): retry après 5s

**Tâches Techniques**:
- [ ] Créer `src/navigation/RootNavigator.tsx`
- [ ] Créer `src/navigation/AuthStack.tsx` (LoginScreen, SignUpScreen)
- [ ] Créer `src/navigation/AppTabs.tsx` (Lobby, Game, Settings)
- [ ] Créer `src/shared/hooks/useStartupToken.ts` (verify token on app open)
- [ ] Setup Axios interceptors en `src/shared/api/apiClient.ts`
- [ ] Créer SplashScreen ou utiliser expo built-in

**Definition of Done**:
- ✅ RootNavigator fonctionne (3 states)
- ✅ Token vérifié au démarrage app
- ✅ 401 géré (auto-logout)
- ✅ Logout fonctionne completement
- ✅ TypeScript types strict

---

### Definition of Done Global Sprint 1

- ✅ AuthStore complètement implémenté avec Zustand
- ✅ authService avec login/register/logout/getToken
- ✅ Secure token storage fonctionnel
- ✅ Tous les screens de login/signup créés et testés
- ✅ RootNavigator avec 3 états (loading, auth, app)
- ✅ Axios interceptors OK (Bearer token + 401 handling)
- ✅ Validations côté client pour tous les inputs
- ✅ Gestion erreurs API (toasts)
- ✅ Code 100% TypeScript strict
- ✅ All 9 acceptance tests (T1.1.x, T1.2.x, T1.3.x) passing

### Risques Sprint 1

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Problème token expiration | Basse | Moyen | Implém. refresh token (bonus après sprint) |
| Secure store permission | Basse | Haut | Tester sur iOS/Android device |
| API non accessible | Basse | Critique | Mock API response en dev |

---

## Sprint 2: Lobby & QR Code (EPIC 2)

**⏱️ Durée** : 10-13 heures (2.5 jours)  
**📍 Dépendances** : Sprint 1 DONE  
**🎯 Objectif** : Créer/rejoindre sessions, générer QR codes, polling en temps réel  
**✅ Blockers** : Aucun si Sprint 1 OK

### User Stories Détaillées

#### US 2.1 : Créer une Session & QR Code - 7 points

**Description** : Joueur créé nouvelle session et obtient QR code pour inviter d'autres

**Critères d'acceptation détaillés** :

1. **CreateSessionScreen - Interface (1.5h)**
   - [ ] Accédé depuis LobbyListScreen via bouton "Nouvelle session"
   - [ ] Input `sessionName` : optionnel, placeholder "Nom de la partie" (défaut: "Session de {username}")
   - [ ] Dropdown `maxPlayers` : [2, 3, 4], défaut 4
   - [ ] Button "Créer la session" : soumet form
   - [ ] Button "Annuler" : back to LobbyListScreen
   - [ ] Loading spinner pendant créatio
   - [ ] Error toast si API error

2. **API Call & Response (1h)**
   - [ ] POST `https://api.../sessions` avec body `{ name, max_players }`
   - [ ] Response: `{ session: { id, name, creator_id, state: "waiting", qr_code_data, ... } }`
   - [ ] Session sauvegardée dans LobbyStore (Zustand)
   - [ ] Error: afficher toast API message

3. **QR Code Display (1.5h)**
   - [ ] Composant `QRDisplayComponent` montré après création succès
   - [ ] QR Code contient: `${BASE_URL}/join/${session.id}` ou `${session.id}`
   - [ ] Générer QR avec `react-native-qrcode-svg`
   - [ ] Button "Copier le code" : copie vers clipboard (react-native-clipboard)
   - [ ] Button "Partager" : share intent Android/iOS (optionnel)
   - [ ] Message: "Invitez vos amis à scaner ce QR Code"
   - [ ] Auto-redirection vers SessionDetailScreen (StartPolling)

4. **State Management (1h)**
   - [ ] LobbyStore: `createSession()`, `setCurrentSession()`
   - [ ] Loading/error display
   - [ ] Redirection automatique post-création

**Tâches Techniques**:
- [ ] Créer `src/features/lobby/stores/lobbyStore.ts` (Zustand)
  - États: `currentSession`, `sessions[]`, `players[]`, `loading`, `error`
  - Actions: `createSession()`, `setCurrentSession()`, `addPlayer()`, `removePlayer()`
- [ ] Créer `src/features/lobby/services/sessionService.ts`
  - `createSession(name, maxPlayers)`, `joinSession(id)`, `leaveSession(id)`, `kickPlayer()`, `banPlayer()`, `deleteSession()`, `startGame()`
- [ ] Créer `src/features/lobby/screens/CreateSessionScreen.tsx`
- [ ] Créer `src/features/lobby/components/QRDisplayComponent.tsx`
- [ ] Installer dépendances: `react-native-qrcode-svg`, `@react-native-clipboard/clipboard`
- [ ] Test: créer session → QR affiché → copie code OK

**Definition of Done**:
- ✅ CreateSessionScreen fonctionne end-to-end
- ✅ Session créée via API
- ✅ QR code généré et affiché
- ✅ Copy-to-clipboard fonctionne
- ✅ Auto-redirection post-création

---

#### US 2.2 : Rejoindre une Session via QR/Code - 7 points

**Description** : Joueur rejoint une session en scannant QR ou entrant code manuel

**Critères d'acceptation détaillés** :

1. **JoinSessionScreen - Interface (1.5h)**
   - [ ] Accédé depuis LobbyListScreen via bouton "Rejoindre une session"
   - [ ] Affiche 2 options:
     - Tab A: "Scanner QR Code" + bouton scan camera
     - Tab B: "Code manuel" + input code
   - [ ] Button "Annuler" : back
   - [ ] Responsive layout (tabs ou buttons)

2. **QR Scanner (2h)**
   - [ ] Utiliser `expo-camera` + `expo-barcode-scanner`
   - [ ] Permission demandée au tap "Scanner QR"
   - [ ] Camera preview affiché full-screen
   - [ ] Bounding box ou guide visuel centré
   - [ ] Une fois QR scanné: extraire session ID/code
   - [ ] Auto-call API POST `/sessions/{id}/join`
   - [ ] Error handling: QR invalide, session inexistante, etc.
   - [ ] Back button ou swipe dismiss

3. **Manual Code Input (1h)**
   - [ ] Input `invitationCode` : placeholder "Entrez le code d'invitation (ex: ABC123)"
   - [ ] Uppercase auto-convert
   - [ ] Button "Rejoindre"
   - [ ] POST `/sessions/{code}/join` (same endpoint, accept code or id)

4. **API Call & State (1.5h)**
   - [ ] POST `https://api.../sessions/{id}/join` avec body `{ }`
   - [ ] Response: `{ session: { id, name, creator_id, players: [...], ... } }`
   - [ ] Erreurs gérées:
     - Session pleine (max_players reached)
     - Session inexistante (404)
     - Déjà membre
     - Session en cours
   - [ ] Afficher toast error spécifique

5. **State & Navigation (1h)**
   - [ ] LobbyStore: `joinSession()`, `setCurrentSession()`
   - [ ] Success: redirection SessionDetailScreen
   - [ ] Error: toast rouge, stay on JoinSessionScreen
   - [ ] Start polling (voir US 2.3)

**Tâches Techniques**:
- [ ] Créer `src/features/lobby/screens/JoinSessionScreen.tsx`
- [ ] Créer `src/features/lobby/components/QRScanner.tsx`
- [ ] Créer `src/features/lobby/components/CodeInput.tsx`
- [ ] Installer: `expo-camera`, `expo-barcode-scanner`
- [ ] Test: scanner QR → redirection, manual code → redirection

**Definition of Done**:
- ✅ JoinSessionScreen fonctionne
- ✅ QR scanner fonctionne (iOS + Android)
- ✅ Manual code input fonctionne
- ✅ API call success + error handling
- ✅ Redirection post-join

---

#### US 2.3 : Lobby Polling en Temps Réel - 5 points

**Description** : Liste joueurs mise à jour automatiquement toutes les 30s via polling

**Critères d'acceptation détaillés** :

1. **SessionDetailScreen - Interface (1.5h)**
   - [ ] Header: "Salon : {session.name}"
   - [ ] Info: "Créateur : {creator.username}", "{players.length}/4 joueurs"
   - [ ] List composant: affiche tous les joueurs (FlatList)
     - Per joueur: avatar (initiale), nom, badge créateur si applicable
   - [ ] Bottom section: boutons (Quitter, Kick, Ban, Démarrer - voir US 2.4, 3.x)
   - [ ] Pull-to-refresh optionnel (déclench polling immédiat)
   - [ ] Loading spinner si premier load

2. **Polling HTTP (2h)**
   - [ ] Démarré au mont SessionDetailScreen
   - [ ] GET `/sessions/{current_session.id}` toutes les 30 secondes
   - [ ] Respecte rate limit: 20 req/min max (1 req per 3s = OK pour polling 30s)
   - [ ] Arrêté au unmount
   - [ ] Arrêté si `state==="running"` → redirection GameScreen
   - [ ] Arrêté si session=404 (supprimée) → toast + redirection LobbyListScreen
   - [ ] Arrêté si 401 (token expiré) → logout + LoginScreen

3. **State Update & Animation (1h)**
   - [ ] GET response: `{ session: { ..., players: [...] } }`
   - [ ] Comparer ancienne vs nouvelle liste
   - [ ] Si nouveau joueur: animation slide-in (Animated)
   - [ ] Si joueur parti: animation fade-out + remove
   - [ ] Si liste identique: pas de re-render (memoization)
   - [ ] LobbyStore.setPlayers(newPlayers) ou addPlayer()/removePlayer()

4. **Error Handling & Retry (1h)**
   - [ ] Erreur réseau: afficher toast "Impossible de synchroniser", retry après 30s
   - [ ] 401: logout + LoginScreen (voir Sprint 1)
   - [ ] 403: toast "Session supprimée", redirection LobbyListScreen
   - [ ] 404: toast "Session introuvable", redirection LobbyListScreen

**Tâches Techniques**:
- [ ] Créer `src/features/lobby/screens/SessionDetailScreen.tsx`
- [ ] Créer `src/features/lobby/hooks/usePollingSession.ts` (custom hook pour polling)
  - Logique: useEffect + setInterval, cleanup on unmount
  - Gère start/stop basé sur session state
- [ ] Créer `src/features/lobby/components/PlayerListItem.tsx`
- [ ] Créer `src/features/lobby/components/ModerationPanel.tsx` (basic, détail US 3.1)
- [ ] Test: polling OK, messages arrivent, animations smooth, stop on running

**Definition of Done**:
- ✅ SessionDetailScreen affiche liste joueurs
- ✅ Polling déclenché automatiquement
- ✅ Polling 30s interval respecté
- ✅ Animations présentes et smooth
- ✅ Erreurs gérées (retry, redirection)
- ✅ Stop polling si session running ou supprimée

---

#### US 2.4 : Quitter le Salon - 2 points

**Description** : Non-créateur peut quitter session facilement avant démarrage

**Critères d'acceptation détaillés** :

1. **Quitter Bouton (0.5h)**
   - [ ] Button "Quitter le salon"
   - [ ] Visible sur SessionDetailScreen si state=="waiting"
   - [ ] **DISABLED** si user === creator
   - [ ] Confirmation: "Êtes-vous sûr de vouloir quitter ?"

2. **API Call (0.5h)**
   - [ ] DELETE `/sessions/{session.id}/leave` avec body `{ }`
   - [ ] Response: `{ success: true }`
   - [ ] Error: afficher toast

3. **State & Navigation (0.5h)**
   - [ ] LobbyStore.removeCurrentSession()
   - [ ] Stop polling
   - [ ] Redirection LobbyListScreen
   - [ ] Toast "Vous avez quitté la session"

**Tâches Techniques**:
- [ ] Ajouter method dans sessionService.ts: `leaveSession(sessionId)`
- [ ] Ajouter button dans SessionDetailScreen
- [ ] Test: quitter OK, polling arrêté, redirection

**Definition of Done**:
- ✅ Button "Quitter" fonctionne
- ✅ Confirmation modale présente
- ✅ API appel OK
- ✅ Navigation OK
- ✅ Polling arrêté

---

### Definition of Done Global Sprint 2

- ✅ LobbyStore complètement implémenté (create, join, leave, polling state)
- ✅ sessionService avec 4 methods (create, join, leave, getSession)
- ✅ CreateSessionScreen fonctionne end-to-end
- ✅ QR generation & display OK
- ✅ JoinSessionScreen avec scanner + manual code OK
- ✅ SessionDetailScreen avec liste joueurs OK
- ✅ Polling 30s implémenté et testé
- ✅ Animations présentes (joueur arrive/part)
- ✅ Rate limit respecté (20 req/min)
- ✅ Gestion erreurs complète (network, 401, 403, 404)
- ✅ Code 100% TypeScript strict

### Risques Sprint 2

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Camera permission issues | Moyenne | Moyen | Tester sur device, handle denied |
| Polling timing inexact | Basse | Bas | Utiliser setTimeout précis |
| QR Code scan unreliable | Moyenne | Moyen | Allow manual code input fallback |
| Rate limit breach | Basse | Haut | Augmenter polling interval si nécessaire |

---

## Sprint 3: Modération & Start (EPIC 3)

**⏱️ Durée** : 6-8 heures (1 jour)  
**📍 Dépendances** : Sprint 2 DONE  
**🎯 Objectif** : Créateur modère salon (kick/ban), lance la partie  
**✅ Blockers** : Aucun si Sprint 2 OK

### User Stories Détaillées

#### US 3.1 : Actions de Modération (Kick & Ban) - 5 points

**Description** : Créateur peut expulser ou bannir joueurs
**Critères d'acceptation détaillés** :

1. **ModerationPanel - Interface (1.5h)**
   - [ ] Affichée **SEULEMENT** si user === session.creator
   - [ ] Pour chaque NON-créateur dans liste:
     - Option A: Menu contexte "..." avec [Kick] [Ban]
     - Option B: Swipe left (iOS) / long-press (Android) avec actions
   - [ ] Boutons visuellement distincts (rouge/orange, icônes)
   - [ ] Accessibilité: label text visible avant tap

2. **Kick Action (1.5h)**
   - [ ] Confirmation: "Êtes-vous sûr d'expulser {username} ?" [Annuler] [OK]
   - [ ] POST `/sessions/{id}/kick` avec body `{ player_id }`
   - [ ] Response: `{ success: true, players: [...] }`
   - [ ] Success: joueur retiré liste, toast "Joueur expulsé"
   - [ ] Joueur expulsé: polling retourne joueur absent → auto-redirection LobbyListScreen
   - [ ] Joueur peut rejoindre APRÈS kick (rescanner QR)

3. **Ban Action (1.5h)**
   - [ ] Confirmation: "Êtes-vous sûr de bannir {username} ? Il ne pourra plus rejoindre." [Annuler] [OK]
   - [ ] POST `/sessions/{id}/ban` avec body `{ player_id }`
   - [ ] Response: `{ success: true, ban_list: [...], players: [...] }`
   - [ ] Success: joueur retiré liste, toast "Joueur banni"
   - [ ] Joueur banni: ne peut PAS rejoindre même avec QR (API rejette)
   - [ ] Ban persiste pour la session

4. **State & List Update (1h)**
   - [ ] LobbyStore.removePlayer(playerId) ou setPlayers(newPlayers)
   - [ ] Polling synchronise aussi (joueur disparait de liste côté server)
   - [ ] Animation fade-out + remove du joueur

**Tâches Techniques**:
- [ ] Augmenter sessionService.ts avec: `kickPlayer(sessionId, playerId)`, `banPlayer(sessionId, playerId)`
- [ ] Créer `src/features/lobby/components/PlayerContextMenu.tsx`
- [ ] Créer `src/features/lobby/components/ModerationConfirmation.tsx` (modale réutilisable)
- [ ] Augmenter SessionDetailScreen avec ModerationPanel
- [ ] Test: kick OK, joueur disparait, peut rejoindre après; ban OK, joueur banni ne peut rejoindre

**Definition of Done**:
- ✅ Kick fonctionne (confirmation + API + state update)
- ✅ Ban fonctionne (confirmation + API + ban-list respected)
- ✅ Boutons visibles SEULEMENT pour créateur
- ✅ Animations présentes (fade-out)
- ✅ Confirmations affichées
- ✅ API errors handled

---

#### US 3.2 : Supprimer la Session - 2 points

**Description** : Créateur peut supprimer session complètement
**Critères d'acceptation détaillés** :

1. **Delete Button (0.5h)**
   - [ ] Button "Supprimer la session" rouge/warning
   - [ ] Visible SEULEMENT au créateur
   - [ ] Dans SessionDetailScreen (ex: menu "...")

2. **Confirmation Modale (0.5h)**
   - [ ] "Êtes-vous sûr de vouloir supprimer la session ? Personne ne pourra plus la rejoindre."
   - [ ] [Annuler] [Supprimer]

3. **API Call (0.5h)**
   - [ ] DELETE `/sessions/{id}` avec body `{ }`
   - [ ] Response: `{ success: true }`
   - [ ] Créateur: toast "Session supprimée", redirection LobbyListScreen
   - [ ] Autres joueurs: polling va retourner 404/error, auto-redirection + toast

4. **State Management (0.5h)**
   - [ ] LobbyStore.deleteSession()
   - [ ] Stop polling
   - [ ] Clear currentSession

**Tâches Techniques**:
- [ ] Augmenter sessionService.ts: `deleteSession(sessionId)`
- [ ] Ajouter button dans SessionDetailScreen
- [ ] Test: créateur supprime → 404 sur polling d'autres → auto-redirection

**Definition of Done**:
- ✅ Delete button fonctionne (créateur seulement)
- ✅ Confirmation affichée
- ✅ Créateur redirigé après delete
- ✅ Autres joueurs redirigés automatiquement (polling error)

---

#### US 3.3 : Démarrer la Partie - 3 points

**Description** : Créateur démarre la partie quand prêt (≥2 joueurs)

**Critères d'acceptation détaillés** :

1. **Start Button (1h)**
   - [ ] Button "Commencer la partie" bleu/primaire
   - [ ] Visible SEULEMENT au créateur
   - [ ] **DISABLED** si < 2 joueurs
   - [ ] Tooltip: "Au moins 2 joueurs requis"
   - [ ] Enable/disable dynamique basé sur players.length

2. **API Call (1h)**
   - [ ] POST `/sessions/{id}/start` avec body `{ }`
   - [ ] Response: `{ session: { id, state: "running", game_id }, ... }`
   - [ ] game_id reçu et stocké dans GameStore

3. **State & Navigation (1h)**
   - [ ] LobbyStore.session.state = "running"
   - [ ] Polling arrêté (detected state === "running")
   - [ ] GameStore initialisé avec game_id
   - [ ] Créateur: redirection GameScreen
   - [ ] Autres joueurs: polling détecte running → auto-redirection GameScreen
   - [ ] Toast: "Partie démarrée"

4. **Post-Start Behaviors**
   - [ ] Plus personne peut quitter (leave button disparu/disabled)
   - [ ] Modération buttons CACHÉS (session en cours)
   - [ ] Joueurs vont à GameScreen pour actions en jeu

**Tâches Techniques**:
- [ ] Augmenter sessionService.ts: `startGame(sessionId)`
- [ ] Augmenter usePollingSession hook: arrêter polling si state === "running"
- [ ] Ajouter button dans SessionDetailScreen
- [ ] Créer GameStore (base) en Sprint 4
- [ ] Test: start dengan ≥2 joueurs OK, tous redirectés GameScreen

**Definition of Done**:
- ✅ Start button visible/enabled correctly
- ✅ API call OK
- ✅ Tous joueurs redirigés GameScreen
- ✅ Polling arrêté
- ✅ GameStore initialisé

---

### Definition of Done Global Sprint 3

- ✅ ModerationPanel fonctionne (kick/ban)
- ✅ Kick: joueur retiré, peut rejoindre après
- ✅ Ban: joueur banni, ne peut rejoindre
- ✅ Delete session: créateur OK, autres auto-redirigés
- ✅ Start game: bouton enabled à ≥2 joueurs, tous redirigés
- ✅ Permissions vérifiées (créateur seulement)
- ✅ Confirmations modales affichées
- ✅ Polling synchronise automatiquement
- ✅ Code 100% TypeScript strict

### Risques Sprint 3

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Permission checks (creator) | Basse | Moyen | Vérifier user_id === session.creator_id |
| Ban list persistence | Basse | Moyen | Vérifier API stocke ban_list |
| Redict timing | Basse | Bas | Tester avec polling de 30s |

---

## Sprint 4: Game Map & État (EPIC 4)

**⏱️ Durée** : 6-8 heures (1 jour)  
**📍 Dépendances** : Sprint 3 DONE  
**🎯 Objectif** : Afficher carte et état du joueur en partie  
**✅ Blockers** : Aucun si Sprint 3 OK

### User Stories Détaillées

#### US 4.1 : Affichage de la Carte - 5 points

**Description** : Carte du jeu affichée avec grille, ressources, vaisseaux

**Critères d'acceptation détaillés** :

1. **GameScreen / MapScreen - Interface (1.5h)**
   - [ ] Header: "Tour {round} - {session.name}"
   - [ ] Composant principal: Grille de jeu
   - [ ] Sous-grille: PlayerStatus panel (voir US 4.2)
   - [ ] Bottom navigation tabs: Game, Profile, Chat (optionnel)
   - [ ] Loading spinner au démarrage

2. **Récupération Carte (1h)**
   - [ ] GET `/games/{gameId}/map` UNE SEULE FOIS au montage
   - [ ] Response: `{ width, height, resource_nodes: [{ x, y }, ...] }`
   - [ ] Pas de polling pour la carte (données statiques)
   - [ ] Stocké dans GameStore.map

3. **Rendu Grille (1.5h)**
   - [ ] Dimensions: `width x height` cellules
   - [ ] Taille cellule: responsive (ex: 40px sur mobile, 60px tablet)
   - [ ] Fond gris clair (#f5f5f5) ou pattern
   - [ ] Bordures subtiles entre cellules (1px, #ccc)
   - [ ] Scrollable si grille > viewport (ScrollView horizontal + vertical)
   - [ ] Tap/press sur cellule: highlight ou info (bonus)

4. **Affichage Ressources (1h)**
   - [ ] Pour chaque `{x, y}` dans resource_nodes:
     - Icône minerai/ressource (or/jaune #FFD700)
     - Centré dans cellule
     - Label optionnel: "⛏" ou "Ore"

5. **Affichage Vaisseaux (1.5h)**
   - [ ] Pour chaque ship dans gameState.ships:
     - Position: {x, y}
     - Propriétaire: owner_id
     - Icône: petit triangle/carré/cercle
     - Couleur par joueur (J1=bleu, J2=rouge, J3=vert, etc.)
     - Label optionnel: "J1", "J2"
   - [ ] Vaisseaux z-index > ressources
   - [ ] Animation optional sur mouvement

6. **Responsive & Scroll (0.5h)**
   - [ ] Grille adapt à viewport size
   - [ ] Pinch-to-zoom optional (React Native Gesture Handler)
   - [ ] ScrollView avec momentum scroll

**Tâches Techniques**:
- [ ] Créer `src/features/game/stores/gameStore.ts` (Zustand)
  - États: `gameId`, `map: { width, height, resource_nodes[] }`, `gameState`, `ships[]`, `round`, `resource`, `stats`
  - Actions: `setMap()`, `setGameState()`, `setShips()`, `updateRound()`
- [ ] Créer `src/features/game/services/gameService.ts`
  - `getMap(gameId)`, `getGameState(gameId)`, `submitActions(gameId, actions)`
- [ ] Créer `src/features/game/screens/GameScreen.tsx`
- [ ] Créer `src/features/game/components/GameMap.tsx`
- [ ] Créer `src/features/game/components/GridCell.tsx`
- [ ] Créer `src/features/game/components/ResourceNode.tsx`
- [ ] Créer `src/features/game/components/Ship.tsx`
- [ ] Créer utility: `src/features/game/utils/colorByPlayer.ts` (assigner couleur par player_id)
- [ ] Test: map charge, ressources affichées, vaisseaux affichés correctement, scroll OK

**Definition of Done**:
- ✅ GameScreen fonctionne
- ✅ Carte affichée avec grille responsive
- ✅ Ressources affichées correctement
- ✅ Vaisseaux affichés par joueur (couleurs)
- ✅ Scroll OK si grille > viewport
- ✅ Pas de polling (une seule requête)

---

#### US 4.2 : Affichage États du Joueur - 3 points

**Description** : Stats joueur affichées (tour, minerai, vaisseaux, etc.)

**Critères d'acceptation détaillés** :

1. **PlayerStatus Panel - Interface (1h)**
   - [ ] Affiché sous map ou onglet "Stats"
   - [ ] Card/section visuelle distincte
   - [ ] 2x2 grid ou liste verticale

2. **Infos Affichées (0.5h)**
   - [ ] **Tour** : "Tour {round}/{max_rounds}" (ex: "Tour 3/30")
   - [ ] **Minerai** : "Minerai : {ore} ⛏" (ex: "Minerai : 500")
   - [ ] **Vaisseaux** : "Vaisseaux : {ships.length}" (ex: "Vaisseaux : 5")
   - [ ] **Stats cumulées**:
     - `ships_destroyed`: "Détruits : 5"
     - `resources_collected`: "Collectés : 1200"
     - Autres du serveur
   - [ ] **Status d'action**:
     - Si NOT submitted: "Actions non validées ⚠️"
     - Si submitted: "Actions validées ✅"

3. **API Call (0.5h)**
   - [ ] GET `/games/{gameId}/state` UNE FOIS au montage
   - [ ] Response: `{ round, resource: { ore }, stats: { ships_destroyed, resources_collected }, ships, round_actions_submitted }`
   - [ ] Pas de polling (données actualisées au submit d'actions)
   - [ ] Stocké dans GameStore.gameState

4. **Format & Design (0.5h)**
   - [ ] Icônes visuelles (⛏ minerai, 🚀 vaisseaux, etc.)
   - [ ] Police monospace pour nombres (optional)
   - [ ] Contraste bon, lisible sur différents fonds

**Tâches Techniques**:
- [ ] Augmenter gameService.ts: `getGameState(gameId)`
- [ ] Créer `src/features/game/components/PlayerStatusPanel.tsx`
- [ ] Créer `src/features/game/types/index.ts` (GameState, Ship, etc.)
- [ ] Test: infos du joueur affichées correctement

**Definition of Done**:
- ✅ PlayerStatusPanel affichée
- ✅ Tous infos affichées correctement
- ✅ Icônes et design OK
- ✅ API call OK (une fois seulement)

---

#### US 4.3 : Gestion Erreurs & Retry - 2 points

**Description** : Erreurs gérées proprement, retry possible

**Critères d'acceptation détaillés** :

1. **States Visuels (1h)**
   - [ ] Loading initial: spinner fullscreen + "Chargement de la partie..."
   - [ ] Erreur carte: toast + bouton "Retry"
   - [ ] Erreur état: toast + bouton "Retry"
   - [ ] Offline: toast "Pas de connexion", allow retry

2. **Retry Logic (0.5h)**
   - [ ] Bouton "Retry" relance GET /map + GET /state
   - [ ] Max 3 tentatives avant "Impossible de charger"
   - [ ] Exponential backoff: 1s, 2s, 4s
   - [ ] Logging errors (console ou remote)

3. **Edge Cases (0.5h)**
   - [ ] Session supprimée pendant jeu: redirection LobbyListScreen + toast
   - [ ] Joueur banni: redirection LobbyListScreen + toast "Vous avez été banni"
   - [ ] Timeout API (>5s): auto-retry ou toast "Timeout"

**Tâches Techniques**:
- [ ] Ajouter error state & retry logic dans GameScreen
- [ ] Créer `src/features/game/components/ErrorFallback.tsx`
- [ ] Créer util: `src/shared/utils/retryWithBackoff.ts`
- [ ] Test: trigger error, retry OK, max attempts OK, edge cases handled

**Definition of Done**:
- ✅ Loading state affiché
- ✅ Erreurs affichées (toast)
- ✅ Retry fonctionne
- ✅ Max retries implémenté (3x)
- ✅ Edge cases handled (banned, session deleted)

---

### Definition of Done Global Sprint 4

- ✅ GameStore complètement implémenté
- ✅ gameService avec getMap() et getGameState()
- ✅ GameScreen affiche carte + état joueur
- ✅ Grille affichée responsively
- ✅ Ressources affichées correctement
- ✅ Vaisseaux affichés par joueur (couleurs)
- ✅ Stats joueur affichées complètement
- ✅ Erreurs gérées (loading, toast, retry)
- ✅ Retry logic implémenté (max 3x, backoff)
- ✅ Edge cases handled (banned, session deleted)
- ✅ Code 100% TypeScript strict

### Risques Sprint 4

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| Grille très grande | Basse | Moyen | Implém. virtual scrolling (lazy render) |
| Z-index issues | Basse | Bas | CSS z-index correct dans components |
| Responsiveness problems | Basse | Moyen | Tester sur 3 tailles device |

---

## Dépendances & Risques Globaux

### Dependency Tree

```
┌─────────────────────────────────────────────┐
│ Sprint 1: EPIC 1 (Authentification)         │
│ - authStore, LoginScreen, SignUpScreen      │
│ - Secure token storage, Interceptors        │
└──────────────┬──────────────────────────────┘
               │ (User authentifié)
               ↓
┌─────────────────────────────────────────────┐
│ Sprint 2: EPIC 2 (Lobby & QR)               │
│ - lobbyStore, SessionDetailScreen           │
│ - QR generation, Polling HTTP               │
└──────────────┬──────────────────────────────┘
               │ (Session créée/rejointe)
               ↓
┌─────────────────────────────────────────────┐
│ Sprint 3: EPIC 3 (Modération)               │
│ - Kick, Ban, Delete, Start game             │
│ - Creator-only permissions                  │
└──────────────┬──────────────────────────────┘
               │ (Partie démarrée)
               ↓
┌─────────────────────────────────────────────┐
│ Sprint 4: EPIC 4 (Game Map & État)          │
│ - GameScreen, Map display, Stats            │
│ - Error handling & Retry                    │
└─────────────────────────────────────────────┘
```

### Risques Globaux

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| API server down | Basse | Critique | Mock API en dev, contact serveur owner |
| Token expiration (>24h) | Basse | Moyen | Implém. refresh token (bonus sprint 5) |
| Rate limit breach (>20 req/min) | Basse | Moyen | Monitor polling, augmenter interval si nécessaire |
| Timezone issues | Basse | Bas | Use server timestamps, ISO 8601 |
| Android vs iOS differences | Moyenne | Moyen | Test sur device dès début |
| Device memory/performance | Basse | Moyen | Profile app avec Flipper, optimize renders |

### Cross-Sprint Dependencies

- **Token Management** : Sprint 1 → Used in all API calls (Sprints 2-4)
- **User State** : Sprint 1 → Used in Sprints 2-4 (creator checks, player list)
- **Session State** : Sprint 2 → Used in Sprints 3-4 (visibility of moderation, game state)
- **Game State** : Sprint 3 → Used in Sprint 4 (game_id passed from session to game)

---

## Backlog Bonus

**Post-MVP Features** (Après Sprint 4, si temps disponible):

### Bonus 1 : Refresh Token (2-3h)
- Implém. refresh token mechanism
- 401 → auto-refresh + retry request
- Extends user session beyond 24h

### Bonus 2 : Offline Mode & Sync (3-4h)
- Local cache de session/game state
- Sync on reconnect
- Optimistic updates

### Bonus 3 : Animations & Polish (2-3h)
- Smooth transitions between screens
- Lottie animations (loading, errors)
- Gesture feedback (haptics)

### Bonus 4 : Settings & Profile (2-3h)
- Profile screen: username, stats, logout
- Settings: difficulty, notifications, theme
- Leaderboard (optionnel)

### Bonus 5 : Chat / Social (3-5h)
- In-game chat (real-time via WebSocket ou long-poll)
- Friend list, invites
- Notifications

### Bonus 6 : Game Actions (4-6h)
- Submit actions screen
- Visual action builder
- Turn timer

---

## Checklist Pre-Production

**Avant de considérer le projet "DONE"** :

- [ ] Tous users stories complétées et testées
- [ ] No console errors / warnings
- [ ] TypeScript strict mode: no `any` types
- [ ] Tests manuels sur iOS + Android device
- [ ] API rate limits respectés (20 req/min)
- [ ] Erreurs réseau gérées (toasts, retry)
- [ ] Tokens secure stockés (expo-secure-store)
- [ ] Logout possible partout
- [ ] App splash screen fonctionnel
- [ ] Navigation transitions smooth
- [ ] App icon & name config OK
- [ ] Ready for App Store / Play Store submit

---

## Notes de Gestion

### Estimation Accuracy
- Estimations points = Fibonacci (3, 5, 8, 13, 21)
- Temps réel = points × 0.5 heure (ex: 13 points = 6.5h)
- Buffer = 20% (pour debug, review, edge cases)

### Daily Status
- **Pour chaque jour** : Log dans ce fichier las tâches complétées
- Format: `[✅ Completed]` ou `[🟡 In Progress]` ou `[❌ Blocked]`

### Communication avec API Server
- Base URL: `https://space-conquest-online.osc-fr1.scalingo.io/api`
- Rate limit: 20 req/min global
- Polling min: 30s interval
- Auth: Bearer token in Authorization header
- Content-Type: application/json

---

## Résumé Timeline

```
┌─────────────────────────────────────────────────────────────┐
│                   SPACE CONQUEST ONLINE                     │
│                  Sprint Planning Dashboard                 │
├────────┬─────────┬────────┬────────┬──────────────────────┤
│ Sprint │  Épic   │ Points │ Heures │ Status               │
├────────┼─────────┼────────┼────────┼──────────────────────┤
│   1    │ Auth    │  13    │ 6-8h   │ 🟡 À démarrer      │
│ Sprint │ Lobby   │  21    │10-13h  │ 🟡 À démarrer      │
│   3    │ Modération│ 13   │ 6-8h   │ 🟡 À démarrer      │
│   4    │ Game    │  13    │ 6-8h   │ 🟡 À démarrer      │
├────────┼─────────┼────────┼────────┼──────────────────────┤
│ TOTAL  │ MVP     │  60    │22-26h  │ 🟡 À démarrer      │
└────────┴─────────┴────────┴────────┴──────────────────────┘
```

**Next Action** : 
1. ✅ Lire ce document entièrement
2. 🟡 Démarrer Sprint 1 US 1.1 (SignUpScreen)
3. 🟡 Follow checklist "Definition of Done" par US
4. 🟡 Log progress quotidiennement

**Bon courage! 🚀**
- Error handling ✓

---

## 3. Timeline

```
Semaine 1 (23-29 mars)   :  Fondations + Épic 1 + Début Épic 2
├─ Lundi 23   : Architecture setup, project init
├─ Mardi 24   : Épic 1 screens + auth service
├─ Mercredi 25: Épic 1 testing + Épic 2 start (sessions)
├─ Jeudi 26   : Épic 2 QR integration
└─ Vendredi 27: Épic 2 polling + testing

Semaine 2 (30 mars-5 avril) : Épic 2 finish + Épic 3 + Début Épic 4
├─ Lundi 30   : Épic 2 edge cases + Épic 3 start (moderation)
├─ Mardi 31   : Épic 3 kick/ban/delete
├─ Mercredi 1 : Épic 3 start-game + testing
├─ Jeudi 2    : Épic 4 start (map display)
└─ Vendredi 3 : Épic 4 map + player stats

Semaine 3 (6-7 avril)      : Épic 4 finish + Polish + Bonus
├─ Samedi 6   : Épic 4 edge cases + error handling
└─ Dimanche 7 : Final polish + code review + commit
```

---

## 4. Dépendances d'Implémentation

```
Épic 1 ────────→ Épic 2 ────────→ Épic 3 ────────→ Épic 4
(3-4j)          (5-6j)          (3-4j)          (3-4j)
                                                  ↓
                                            (Bonus)
                                            Actions + Results
```

**Chemin critique** :
1. Auth fonctionnelle (sans cela, impossible de tester la suite)
2. Lobby fonctionnel + Polling (base du multiplayer)
3. Start game (launch la partie)
4. Game display (endgame)

---

## 5. Ressources Externes Requises

### APIs
- ✅ API REST : https://space-conquest-online.osc-fr1.scalingo.io/api
- ✅ Documentation : https://space-conquest-online.osc-fr1.scalingo.io/api/documentation

### Dépendances NPM
```javascript
{
  // Core
  "react": "^18.x",
  "react-native": "^0.73.x",
  "expo": "^50.x",
  
  // Navigation
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@react-navigation/stack": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x",
  
  // State Management
  // Context API + useReducer (built-in, no deps)
  
  // API
  "axios": "^1.x",
  // ou "fetch" (built-in)
  
  // Secure Storage
  "expo-secure-store": "^12.x",
  // ou "@react-native-async-storage/async-storage": "^1.x"
  
  // QR Code
  "expo-barcode-scanner": "^12.x",
  "expo-camera": "^13.x",
  "react-native-qrcode-svg": "^6.x",
  
  // UI Components (optionnel)
  "react-native-paper": "^5.x",
  // ou "native-base": "^4.x"
  
  // Utils
  "date-fns": "^2.x",
  "lodash": "^4.x",
  
  // Dev
  "typescript": "^5.x",
  "eslint": "^8.x",
  "prettier": "^3.x"
}
```

---

## 6. Architecture & Setup

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour :
- Folder structure
- Navigation architecture
- Context API organization
- Service layer design
- Hooks patterns

---

## 7. Standards & Best Practices

### Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Comments on complex logic
- ✅ Error handling everywhere

### State Management
- ✅ Context API + useReducer (no Redux)
- ✅ One context per domain
- ✅ Custom hooks encapsulation

### API
- ✅ Axios client with interceptors
- ✅ Centralized error handling
- ✅ Polling respects rate limits (20 req/min)

### Security
- ✅ Token in SecureStore
- ✅ 401 handling → logout
- ✅ No sensitive data in logs

### Testing
- ✅ Manual acceptance tests (list in PRDs)
- ✅ Edge case testing
- ✅ Error scenario testing

---

## 8. Definition of Doneness (Epic Level)

Un épique est considéré "DONE" si :

1. ✅ Tous les user stories implémentés
2. ✅ Tous les acceptance criteria validés
3. ✅ Code écrit en TypeScript
4. ✅ Error handling robuste
5. ✅ Manual testing successively completed
6. ✅ Comments explicatifs ajoutés
7. ✅ Ready for code review

---

## 9. Risk & Mitigation

### Risk 1 : Rate Limiting API
**Impact** : Polling bloqué, UX dégradée  
**Mitigation** : Bien tester les interval, 30s minimum pour lobby polling

### Risk 2 : QR Code Scanner Issues
**Impact** : Impossible de rejoindre une session  
**Mitigation** : Fallback input manuel, test physique sur devices réels

### Risk 3 : Token Management Complexity
**Impact** : Authentication bugs  
**Mitigation** : Tests exhaustifs + edge case coverage (expiry, refresh)

### Risk 4 : Responsive Design sur petits écrans
**Impact** : Carte illisible sur mobile  
**Mitigation** : Scroll + zoom, testing sur multiples devices

---

## 10. Bonus Features (Out of Scope Initial)

Si temps permet après épic 4 :

- [ ] **Actions Submission** : Interface pour jouer ses actions chaque tour
- [ ] **Turn Results** : Afficher résultats du tour après validation
- [ ] **Polling Game State** : Updates en temps réel de l'état
- [ ] **Refresh Token** : Extend token validity (24h → auto-refresh)
- [ ] **User Profile** : Page profil + stats globales
- [ ] **Chat In-Game** : Communication joueurs
- [ ] **Settings** : Thème, notifications, etc.
- [ ] **Replay Mode** : Rejeu des tours passés

---

## 11. Démarrage du Développement

### Step 1 : Project Setup (Jour 1)
```bash
# Créer project Expo
npx create-expo-app@latest my-app --template with-typescript

# Installer dépendances fondamentales
cd my-app
npm install axios expo-secure-store expo-barcode-scanner expo-camera
npm install @react-navigation/native @react-navigation/bottom-tabs ...

# Setup ESLint + TypeScript
npx eslint --init
```

### Step 2 : Folder Structure (Jour 1)
```bash
mkdir -p src/{app,contexts,hooks,services,screens,components,types,utils,config}
touch src/app/App.tsx src/app/RootNavigator.tsx
# ... (créer autres fichiers clés)
```

### Step 3 : Authentication (Jour 2-3)
```bash
# Développer Épic 1 en parallèle avec structure setup
# Commits : auth-init, auth-signup, auth-login, auth-navigation
```

### Step 4 : Lobby + QR (Jour 4-8)
```bash
# Épic 2 implémentation
# Commits : lobby-create, lobby-join, lobby-polling
```

### Step 5 : Moderation (Jour 8-11)
```bash
# Épic 3 implémentation
# Commits : moderation-kick-ban, moderation-delete, game-start
```

### Step 6 : Game Display (Jour 11-15)
```bash
# Épic 4 implémentation
# Commits : game-map, game-state, game-polish
```

### Step 7 : Final Polish (Jour 15-16)
```bash
# Error handling, edge cases, code review
# Final commit + push to GitHub
```

---

## 12. Checkliste Final Submission

- [ ] Code sur GitHub (repo public)
- [ ] README.md avec instructions setup
- [ ] TypeScript strict mode obligatoire
- [ ] Aucun linting errors
- [ ] All 4 Epics implémentés
- [ ] Tests manuels tous validés
- [ ] Code review self-review complétée
- [ ] Comments explicatifs finalisés
- [ ] Responsive design testé
- [ ] API integration correct
- [ ] Secure storage fonctionnel
- [ ] Pas de token hardcodé
- [ ] Pas de console.log en production
- [ ] Performance acceptable

---

**Fin du Sprint Planning Document**

Version 1.0 - [ARCHITECTURE.md](ARCHITECTURE.md) | [PRD_EPIC1_AUTH.md](PRD_EPIC1_AUTH.md) | [PRD_EPIC2_LOBBY.md](PRD_EPIC2_LOBBY.md) | [PRD_EPIC3_MODERATION.md](PRD_EPIC3_MODERATION.md) | [PRD_EPIC4_GAME.md](PRD_EPIC4_GAME.md)

