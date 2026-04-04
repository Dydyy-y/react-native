# Sprint Planning & Roadmap

**Date** : 24 mars 2026 (mis à jour 04 avril 2026)  
**Durée Totale** : 2 semaines (jusqu'au 07 avril 2026 23h59)  
**Equipe** : Individuel (Mathys)  
**Status** : Sprint 1 terminé, Sprint 2 terminé, Sprint 3 terminé, Sprint 4 terminé

**Approche** : Agile + Context API + useReducer + Feature-Folder + TypeScript strict

---

## Table des Matières

1. [Vue d'ensemble & Timeline](#vue-densemble--timeline)
2. [Sprint 1: Authentification (Étape 1)](#sprint-1--authentification-étape-1)
3. [Sprint 2: Lobby & QR Code (Étape 2)](#sprint-2--lobby--qr-code-étape-2)
4. [Sprint 3: Modération & Démarrage (Étape 3)](#sprint-3--modération--démarrage-étape-3)
5. [Sprint 4: Carte & État de jeu (Étape 4)](#sprint-4--carte--état-de-jeu-étape-4)
6. [Sprint 5: Actions de jeu (Étape 5)](#sprint-5--actions-de-jeu-étape-5)
7. [Sprint 6: Fin de partie, Profil & Historique (Étapes 5bis + 6)](#sprint-6--fin-de-partie-profil--historique-étapes-5bis--6)
8. [Dépendances & Risques Globaux](#dépendances--risques-globaux)
9. [Backlog Bonus](#backlog-bonus)

---

## Vue d'ensemble & Timeline

### Métriques par Sprint

| Sprint | Étape consigne | Points | Heures | Dépend de | Status |
|--------|---------------|--------|--------|-----------|--------|
| 1 | Étape 1 — Auth | 13 | 6-8h | RIEN | ✅ Terminé |
| 2 | Étape 2 — Lobby & QR | 21 | 8-10h | Sprint 1 | ✅ Terminé |
| 3 | Étape 3 — Modération | 10 | 4-6h | Sprint 2 | ✅ Terminé |
| 4 | Étape 4 — Carte & État | 10 | 4-6h | Sprint 3 | A démarrer |
| 5 | Étape 5 — Actions de jeu | 13 | 6-8h | Sprint 4 | A démarrer |
| 6 | Étapes 5bis+6 — Fin & Profil | 8 | 4-6h | Sprint 5 | A démarrer |

### Timeline (mise à jour 04 avril)

**Stratégie** : Qualité > quantité (consigne). Livrer une app fonctionnelle de bout en bout plutôt que des features à moitié finies.

```
Vendredi 4 avril   : Sprint 2 (Lobby + QR + Polling) — PRIORITÉ ABSOLUE
Samedi 5 avril     : Sprint 3 (Modération + Démarrage) + Sprint 4 (Carte FlatList)
Dimanche 6 avril   : Sprint 5 (Actions de jeu : move, attack, purchase)
Lundi 7 avril AM   : Sprint 6 (Fin de partie + Profil + Historique)
Lundi 7 avril PM   : Polish, tests manuels, README, vérification consigne
```

**Point d'arrêt sûr** : Si le temps manque, s'arrêter après Sprint 4. L'app aura auth + lobby + modération + carte = fonctionnelle de bout en bout.

---

## Sprint 1 : Authentification (Étape 1)

**Durée** : 6-8 heures  
**Dépendances** : Aucune  
**Objectif** : Inscription, connexion, navigation protégée, tokens sécurisés  
**Status** : ✅ Terminé

### US 1.1 : Créer un compte (Sign Up) — 5 points ✅

**Description** : Nouveau joueur crée un compte avec username, email & password

**Critères d'acceptation** :

1. **SignUpScreen — Interface**
   - [x] Title : "Créer un compte"
   - [x] Input `username` : placeholder "Nom d'utilisateur"
   - [x] Input `email` : placeholder "Email"
   - [x] Input `password` : masked, placeholder "Mot de passe"
   - [x] Input `confirmPassword` : masked, placeholder "Confirmer mot de passe"
   - [x] Button "S'inscrire" : disabled si form invalide
   - [x] Link "Vous avez déjà un compte ? Se connecter" -> LoginScreen
   - [x] Error display sous chaque champ (rouge)
   - [x] Loading spinner pendant requête

2. **Validations côté client**
   - [x] Username : 3-20 caractères, regex `/^[a-zA-Z0-9_]+$/`
   - [x] Email : format email valide
   - [x] Password : min 8 caractères
   - [x] confirmPassword === password
   - [x] Erreurs affichées en temps réel (onBlur)

3. **Appel API & Storage**
   - [x] POST `/auth/register` avec body `{ username, email, password }`
   - [x] Token sauvegardé dans `expo-secure-store` via `tokenStorage.ts`
   - [x] User dispatch dans AuthContext via `useRegister` hook
   - [x] En cas erreur : toast via UIContext

4. **State Management (Context API + useReducer)**
   - [x] AuthContext : `dispatch({ type: 'SET_USER', payload })` + `dispatch({ type: 'SET_TOKEN', payload })`
   - [x] Loading state dans le hook `useRegister`
   - [x] Success : navigation automatique vers AppTabs (RootNavigator réagit au changement de state)

**Fichiers créés** :
- `src/features/auth/contexts/AuthContext.tsx` (Context + Reducer + Provider)
- `src/features/auth/services/authService.ts` (appels API)
- `src/features/auth/services/tokenStorage.ts` (expo-secure-store wrapper)
- `src/features/auth/hooks/useRegister.ts` (hook de récupération API)
- `src/features/auth/screens/SignUpScreen.tsx`
- `src/features/auth/types/auth.types.ts`
- `src/shared/utils/validation.ts`

---

### US 1.2 : S'authentifier (Sign In) — 5 points ✅

**Description** : Joueur existant se connecte et son token est utilisé automatiquement

**Critères d'acceptation** :

1. **LoginScreen — Interface**
   - [x] Title : "Se connecter"
   - [x] Input `emailOrUsername` : placeholder "Email ou nom d'utilisateur"
   - [x] Input `password` : masked, placeholder "Mot de passe"
   - [x] Button "Se connecter" : disabled si form invalide
   - [x] Link "Pas encore inscrit ? Créer un compte" -> SignUpScreen
   - [x] Loading spinner pendant requête

2. **Validations côté client**
   - [x] emailOrUsername : non-vide
   - [x] Password : min 8 caractères

3. **Appel API & Storage**
   - [x] POST `/auth/login` avec body `{ email_or_username, password }`
   - [x] Token sauvegardé dans `expo-secure-store`
   - [x] Header Authorization ajouté automatiquement par interceptor Axios
   - [x] Erreur : toast via UIContext

4. **State Management (Context API + useReducer)**
   - [x] AuthContext : `SET_TOKEN` + `SET_USER`
   - [x] Hook `useLogin` gère loading/error
   - [x] Success : navigation automatique vers AppTabs

**Fichiers créés** :
- `src/features/auth/hooks/useLogin.ts`
- `src/features/auth/screens/LoginScreen.tsx`
- `src/shared/config/apiClient.ts` (Axios instance + interceptors)
- `src/shared/utils/constants.ts` (API_BASE_URL, TOKEN_KEY, COLORS)

---

### US 1.3 : Navigation Protégée & Token Management — 3 points ✅

**Description** : App protégée, utilisateurs non-connectés redirigés vers login

**Critères d'acceptation** :

1. **RootNavigator Logic**
   - [x] `isLoading=true` -> SplashScreen (vérification token)
   - [x] `isLoading=false && !user` -> AuthStack (LoginScreen/SignUpScreen)
   - [x] `isLoading=false && user` -> AppTabs (Lobby, Game, Profile)

2. **App Startup Token Verification**
   - [x] Au montage AuthProvider : vérifier token dans `expo-secure-store`
   - [x] Si token existe : GET `/auth/me` pour valider
   - [x] Si valide : charger user dans AuthContext
   - [x] Si invalide/401 : supprimer token, afficher LoginScreen

3. **Logout / Déconnexion**
   - [x] Bouton logout dans ProfileScreen
   - [x] Confirmation modale (Alert)
   - [x] Action : supprimer token + dispatch LOGOUT + navigation auto

4. **Token Interceptor & 401 Handling**
   - [x] Interceptor requête : ajoute `Authorization: Bearer {token}`
   - [x] Interceptor réponse : 401 -> logout automatique
   - [x] Configuration via callbacks injectés (pas d'import croisé shared -> features)

**Fichiers créés** :
- `src/navigation/RootNavigator.tsx`
- `src/navigation/AuthStack.tsx`
- `src/navigation/AppTabs.tsx` (TabsNavigator obligatoire)
- `src/navigation/NavigationTypes.ts`
- `src/features/auth/screens/SplashScreen.tsx`
- `src/features/auth/screens/ProfileScreen.tsx`
- `src/features/ui/contexts/UIContext.tsx` (Context + Reducer)
- `src/features/ui/components/Toast.tsx` (ToastContainer overlay)
- `src/shared/utils/errorHandler.ts`
- `src/shared/utils/logger.ts`

---

## Sprint 2 : Lobby & QR Code (Étape 2)

**Durée** : 8-10 heures  
**Dépendances** : Sprint 1 terminé  
**Objectif** : Créer/rejoindre sessions, QR code, polling temps réel  
**Status** : ✅ Terminé

### US 2.1 : Créer une session de jeu — 5 points

**Description** : Joueur crée une nouvelle session et obtient un QR code d'invitation

**Critères d'acceptation** :

1. **CreateSessionScreen — Interface**
   - [ ] Accessible depuis LobbyHomeScreen via bouton "Nouvelle session"
   - [ ] Input `sessionName` : placeholder "Nom de la partie"
   - [ ] Button "Créer la session"
   - [ ] Loading spinner pendant création
   - [ ] Error toast si erreur API

2. **Appel API** (POST /sessions)
   - [ ] Body : `{ name }` (vérifier champs exacts dans la doc API)
   - [ ] Response : session avec `id`, `name`, `creator_id`, `state`, `code`
   - [ ] Session stockée dans LobbyContext via dispatch

3. **Affichage QR Code**
   - [ ] QR Code généré contenant le code d'invitation de la session
   - [ ] Message : "Invitez vos amis à scanner ce QR Code"
   - [ ] Redirection automatique vers SessionDetailScreen avec polling

4. **State Management (Context API + useReducer)**
   - [ ] LobbyContext : `dispatch({ type: 'SET_SESSION', payload: session })`
   - [ ] Les joueurs sont dans `session.players` (pas de champ séparé)
   - [ ] Loading/error gérés dans le hook

**Fichiers à créer** :
- `src/features/lobby/contexts/LobbyContext.tsx` (Context + Reducer + Provider)
- `src/features/lobby/services/sessionService.ts`
- `src/features/lobby/screens/LobbyHomeScreen.tsx`
- `src/features/lobby/screens/CreateSessionScreen.tsx`
- `src/features/lobby/components/QRDisplay.tsx`
- `src/features/lobby/hooks/useLobby.ts`
- `src/features/lobby/types/lobby.types.ts`
- `src/features/lobby/index.ts`

---

### US 2.2 : Rejoindre une session via QR Code — 5 points

**Description** : Joueur rejoint une session en scannant un QR code

**Critères d'acceptation** :

1. **JoinSessionScreen — Interface**
   - [ ] Accessible depuis LobbyHomeScreen via bouton "Rejoindre"
   - [ ] Scanner QR code (expo-camera)
   - [ ] Permission caméra demandée
   - [ ] Preview caméra affichée

2. **QR Scanner**
   - [ ] Scan -> extraction du code d'invitation
   - [ ] Appel API automatique pour rejoindre

3. **Appel API** (POST /sessions/{id}/join)
   - [ ] Erreurs gérées : session pleine, inexistante, déjà membre, banni
   - [ ] Toast d'erreur spécifique

4. **State & Navigation**
   - [ ] LobbyContext : `SET_SESSION` avec la session rejointe
   - [ ] Redirection vers SessionDetailScreen si succès

**Fichiers à créer** :
- `src/features/lobby/screens/JoinSessionScreen.tsx`
- `src/features/lobby/components/QRScanner.tsx`

---

### US 2.3 : Affichage du salon en temps réel — 8 points

**Description** : Liste des joueurs mise à jour automatiquement via polling 30s

**Critères d'acceptation** :

1. **SessionDetailScreen — Interface**
   - [ ] Header : "Salon : {session_name}"
   - [ ] Info : "Créateur : {creator_name}", "{players_count}/4 joueurs"
   - [ ] Liste joueurs (FlatList) avec nom + badge créateur
   - [ ] Boutons en bas (Quitter, et actions créateur — voir Sprint 3)

2. **Polling HTTP**
   - [ ] GET `/sessions/{id}` toutes les 30 secondes (rate limit : 20 req/min)
   - [ ] Démarré au mount SessionDetailScreen
   - [ ] Arrêté au unmount ou quand session passe à "running"
   - [ ] Arrêté si session supprimée (404) ou utilisateur expulsé
   - [ ] Utilise le hook partagé `usePolling` depuis `shared/hooks/`

3. **Gestion des mises à jour**
   - [ ] LobbyContext : `SET_SESSION` avec les nouvelles données
   - [ ] Si session.state === "running" -> redirection vers GameScreen

4. **Gestion erreurs polling**
   - [ ] Erreur réseau : toast, retry au prochain intervalle
   - [ ] 401 : logout automatique (interceptor)
   - [ ] 404 : toast "Session supprimée" + redirection LobbyHomeScreen

**Fichiers à créer** :
- `src/features/lobby/screens/SessionDetailScreen.tsx`
- `src/features/lobby/components/PlayerList.tsx`
- `src/shared/hooks/usePolling.ts` (hook générique réutilisable)

---

### US 2.4 : Quitter le salon — 3 points

**Description** : Non-créateur peut quitter la session avant le démarrage

**Critères d'acceptation** :

1. **Bouton "Quitter"**
   - [ ] Visible sur SessionDetailScreen si session.state === "waiting"
   - [ ] Invisible ou disabled si utilisateur est le créateur
   - [ ] Confirmation modale avant action

2. **Appel API** (POST ou DELETE /sessions/{id}/leave — vérifier doc API)
   - [ ] Succès : LobbyContext `CLEAR_SESSION` + redirection LobbyHomeScreen
   - [ ] Erreur : toast

3. **State Management**
   - [ ] Polling arrêté
   - [ ] LobbyContext nettoyé

---

### Definition of Done Sprint 2

- [ ] LobbyContext implémenté (Context API + useReducer)
- [ ] sessionService avec create, join, leave, getSession
- [ ] CreateSessionScreen + QR code generation
- [ ] JoinSessionScreen avec scanner QR
- [ ] SessionDetailScreen avec liste joueurs
- [ ] Polling 30s implémenté via `usePolling`
- [ ] Rate limit respecté (20 req/min)
- [ ] Gestion erreurs complète (réseau, 401, 404)
- [ ] Code TypeScript strict

---

## Sprint 3 : Modération & Démarrage (Étape 3)

**Durée** : 4-6 heures  
**Dépendances** : Sprint 2 terminé  
**Objectif** : Créateur modère le salon (kick/ban/delete) et lance la partie  
**Status** : A démarrer

### US 3.1 : Actions de modération (Kick & Ban) — 3 points

**Description** : Créateur peut expulser ou bannir des joueurs

**Critères d'acceptation** :

1. **Interface**
   - [ ] Boutons kick/ban affichés SEULEMENT si user === créateur de la session
   - [ ] Pour chaque joueur NON-créateur : actions disponibles
   - [ ] Confirmation modale avant chaque action

2. **Kick (Expulsion)**
   - [ ] Appel API : endpoint kick (vérifier doc API)
   - [ ] Joueur retiré de la liste
   - [ ] Joueur expulsé : perd accès session, redirigé vers LobbyHomeScreen au prochain polling
   - [ ] Peut rejoindre à nouveau en rescannant le QR

3. **Ban (Bannissement)**
   - [ ] Appel API : endpoint ban (vérifier doc API)
   - [ ] Joueur retiré de la liste
   - [ ] Joueur banni : ne peut PAS rejoindre à nouveau, même avec le QR

4. **State (Context API + useReducer)**
   - [ ] LobbyContext : mise à jour de la session après kick/ban
   - [ ] Le polling synchronise aussi côté joueur expulsé/banni

---

### US 3.2 : Suppression de la session — 2 points

**Description** : Créateur peut supprimer la session entière

**Critères d'acceptation** :

1. **Bouton "Supprimer"**
   - [ ] Visible SEULEMENT au créateur
   - [ ] Confirmation modale
   - [ ] Appel API DELETE /sessions/{id}

2. **Gestion multi-joueurs**
   - [ ] Créateur : toast "Session supprimée" + redirection LobbyHomeScreen
   - [ ] Autres joueurs : polling retourne 404 -> toast + redirection LobbyHomeScreen

---

### US 3.3 : Démarrer la partie — 5 points

**Description** : Créateur démarre la partie quand au moins 2 joueurs sont présents

**Critères d'acceptation** :

1. **Bouton "Commencer la partie"**
   - [ ] Visible SEULEMENT au créateur
   - [ ] DISABLED si < 2 joueurs
   - [ ] Appel API POST /sessions/{id}/start

2. **Redirection**
   - [ ] Session passe en state "running"
   - [ ] Créateur : redirection vers GameScreen
   - [ ] Autres joueurs : polling détecte state === "running" -> redirection GameScreen
   - [ ] Polling arrêté

3. **Comportements post-démarrage**
   - [ ] Plus personne ne peut quitter
   - [ ] Boutons modération cachés
   - [ ] GameContext initialisé avec le game_id reçu

**Fichiers à créer** :
- Compléter `sessionService.ts` : kickPlayer, banPlayer, deleteSession, startGame
- Compléter `SessionDetailScreen.tsx` avec les boutons créateur

---

### Definition of Done Sprint 3

- [ ] Kick/Ban fonctionnels (créateur seulement)
- [ ] Suppression session + gestion pour tous les joueurs
- [ ] Démarrage partie + redirection de tous les joueurs
- [ ] Confirmations modales pour toutes actions destructives
- [ ] Permissions vérifiées côté UI (créateur seulement)
- [ ] Code TypeScript strict

---

## Sprint 4 : Carte & État de jeu (Étape 4)

**Durée** : 4-6 heures  
**Dépendances** : Sprint 3 terminé  
**Objectif** : Afficher la carte du jeu (grille FlatList) et l'état du joueur  
**Status** : A démarrer

### US 4.1 : Affichage de la carte — 5 points

**Description** : Carte du jeu affichée sous forme de grille avec ressources et vaisseaux

**Critères d'acceptation** :

1. **GameScreen — Interface**
   - [ ] Header : "Tour {round} — {session_name}"
   - [ ] Grille principale (FlatList obligatoire — consigne)
   - [ ] Panneau stats joueur sous la carte

2. **Récupération carte (une seule fois)**
   - [ ] GET /games/{gameId}/map au montage
   - [ ] Response : `{ width, height, resource_nodes: [{ x, y }] }`
   - [ ] PAS de polling pour la carte (données statiques)
   - [ ] Stocké dans GameContext via dispatch `SET_MAP`

3. **Rendu Grille (FlatList)**
   - [ ] Grille de width x height cellules
   - [ ] Fond uni sous la grille pour l'immersion (consigne : pas d'image par case vide)
   - [ ] Images/formes UNIQUEMENT sur les cases avec vaisseau ou ressource (perf FlatList)
   - [ ] Ressources : couleur distinctive (ex: doré)
   - [ ] Vaisseaux : couleur par joueur + icône par type

4. **Récupération état initial**
   - [ ] GET /games/{gameId}/state au montage
   - [ ] Response : `{ round, resource, stats, ships, round_actions_submitted, status }`
   - [ ] Stocké dans GameContext via dispatch `SET_GAME_STATE`

**Fichiers à créer** :
- `src/features/game/contexts/GameContext.tsx` (Context + Reducer + Provider)
- `src/features/game/services/gameService.ts`
- `src/features/game/screens/GameScreen.tsx`
- `src/features/game/components/GameMap.tsx` (FlatList)
- `src/features/game/components/MapCell.tsx`
- `src/features/game/components/PlayerStats.tsx`
- `src/features/game/hooks/useGame.ts`
- `src/features/game/types/game.types.ts`
- `src/features/game/index.ts`

---

### US 4.2 : Affichage de l'état du joueur — 3 points

**Description** : Stats du joueur affichées (tour, minerai, vaisseaux, status actions)

**Critères d'acceptation** :

1. **PlayerStats Panel**
   - [ ] Tour actuel : `round`
   - [ ] Minerai : `resource.ore`
   - [ ] Nombre de vaisseaux
   - [ ] Stats cumulées : `ships_destroyed`, `resources_collected`
   - [ ] Status actions : "Actions validées" ou "Actions non validées" selon `round_actions_submitted`

---

### US 4.3 : Gestion erreurs & loading — 2 points

**Critères d'acceptation** :
- [ ] Loading initial : spinner + "Chargement de la partie..."
- [ ] Erreur carte/état : toast + bouton Retry
- [ ] Session supprimée pendant chargement : redirection LobbyHomeScreen

---

### Definition of Done Sprint 4

- [ ] GameContext implémenté (Context API + useReducer)
- [ ] Carte affichée sous forme de grille FlatList
- [ ] Ressources et vaisseaux visibles aux bonnes positions
- [ ] Stats joueur affichées
- [ ] Erreurs gérées (loading, retry)
- [ ] Code TypeScript strict

---

## Sprint 5 : Actions de jeu (Étape 5)

**Durée** : 6-8 heures  
**Dépendances** : Sprint 4 terminé  
**Objectif** : Permettre les actions de jeu (move, attack, purchase) et le polling d'état  
**Status** : A démarrer

### US 5.1 : Inspection des vaisseaux — 3 points

**Description** : Presser une case affiche les infos du vaisseau présent

**Critères d'acceptation** :
- [ ] Cases pressables (TouchableOpacity dans MapCell)
- [ ] Si vaisseau présent : afficher ses infos (type, HP, attaque, portée, propriétaire)
- [ ] Modal ou panneau d'info

---

### US 5.2 : Actions move & attack — 5 points

**Description** : Joueur sélectionne un vaisseau et effectue une action (déplacement ou attaque)

**Critères d'acceptation** :

1. **Sélection vaisseau**
   - [ ] Tap sur un vaisseau du joueur : le sélectionne (highlight)
   - [ ] Afficher les actions disponibles : "Déplacer" / "Attaquer"

2. **Move**
   - [ ] Afficher les cases à portée de déplacement
   - [ ] Tap sur case cible -> ajouter action `{ type: "move", ship_id, target_x, target_y }`
   - [ ] 1 seule action par vaisseau par tour

3. **Attack**
   - [ ] Afficher les cases à portée d'attaque
   - [ ] Tap sur case cible avec vaisseau ennemi -> ajouter action `{ type: "attack", ship_id, target_x, target_y }`

4. **Validation du tour**
   - [ ] Bouton "Valider mes actions"
   - [ ] POST /games/{gameId}/actions avec body `{ actions: [...] }`
   - [ ] Si erreur de validation serveur : afficher erreur, permettre correction et renvoi
   - [ ] Succès : `round_actions_submitted = true`, UI en mode attente

---

### US 5.3 : Achat de vaisseaux — 3 points

**Description** : Joueur consulte les types de vaisseaux et en achète

**Critères d'acceptation** :
- [ ] Interface listant les types de vaisseaux (GET /games/{gameId}/ship-types ou endpoint équivalent)
- [ ] Pour chaque type : HP, attaque, portée déplacement, portée attaque, gathering_rate, coût
- [ ] Bouton "Acheter" (si minerai suffisant)
- [ ] Après achat : sélectionner case de déploiement (case libre ou ressource, pas de vaisseau dessus)
- [ ] Action `{ type: "purchase", ship_type_id, target_x, target_y }` ajoutée au tour

---

### US 5.4 : Polling d'état & attente entre tours — 2 points

**Description** : Après validation des actions, polling pour détecter le tour suivant

**Critères d'acceptation** :
- [ ] Après submit actions : afficher visuel d'attente ("En attente des autres joueurs...")
- [ ] Le joueur peut consulter la carte mais ne peut plus agir
- [ ] Polling GET /games/{gameId}/state toutes les 30s
- [ ] Quand `round_actions_submitted` revient à `false` : nouveau tour commence
- [ ] Mettre à jour toute l'interface (positions vaisseaux, ressources, round)

**Fichiers à créer** :
- `src/features/game/components/ShipInfo.tsx`
- `src/features/game/components/ActionPanel.tsx`
- `src/features/game/components/ShipShop.tsx`
- Compléter `gameService.ts` : submitActions, getShipTypes

---

### Definition of Done Sprint 5

- [ ] Cases pressables avec info vaisseau
- [ ] Actions move/attack fonctionnelles
- [ ] Achat vaisseaux fonctionnel
- [ ] Validation du tour + gestion erreurs serveur
- [ ] Polling état après validation
- [ ] Transition entre tours fonctionnelle
- [ ] Code TypeScript strict

---

## Sprint 6 : Fin de partie, Profil & Historique (Étapes 5bis + 6)

**Durée** : 4-6 heures  
**Dépendances** : Sprint 5 terminé  
**Objectif** : Gérer l'élimination, la fin de partie, le profil complet et l'historique  
**Status** : A démarrer

### US 6.1 : Élimination des joueurs — 2 points

**Description** : Joueur éliminé (plus de vaisseaux) est informé mais peut encore observer

**Critères d'acceptation** :
- [ ] Détection : le joueur n'a plus de vaisseaux dans `ships`
- [ ] Message clair : "Vous avez été éliminé"
- [ ] Le joueur peut encore voir la carte et les infos
- [ ] Le joueur ne peut plus effectuer d'actions de jeu
- [ ] Le polling continue pour suivre la partie

---

### US 6.2 : Fin de la partie — 3 points

**Description** : Quand un seul joueur reste, la partie est terminée

**Critères d'acceptation** :
- [ ] Détection : `status` passe à "finished" dans l'état de jeu
- [ ] Redirection vers écran de fin de partie (GameOverScreen)
- [ ] Afficher : nom du gagnant, classement, statistiques de la partie
- [ ] Appel API pour récupérer les résultats finaux

**Fichiers à créer** :
- `src/features/game/screens/GameOverScreen.tsx`

---

### US 6.3 : Profil complet — 2 points

**Description** : Écran profil avec infos utilisateur et modification

**Critères d'acceptation** :
- [ ] Afficher nom d'utilisateur et email (déjà fait)
- [ ] Interface de modification : changer nom, email, mot de passe
- [ ] Appel API pour mettre à jour le profil
- [ ] Gestion erreurs de validation
- [ ] Bouton déconnexion (déjà fait)

---

### US 6.4 : Historique des parties — 1 point

**Description** : Liste des parties jouées avec possibilité de consulter les détails

**Critères d'acceptation** :
- [ ] Écran accessible depuis le profil ou un tab dédié
- [ ] Liste des parties (FlatList)
- [ ] Pour chaque partie : nom session, date, résultat (gagné/perdu/éliminé)
- [ ] Tap -> détails de la partie (stats)

**Fichiers à créer/modifier** :
- Compléter `src/features/auth/screens/ProfileScreen.tsx` (modification profil)
- `src/features/auth/screens/GameHistoryScreen.tsx`
- Compléter `authService.ts` : updateProfile, getGameHistory

---

### Definition of Done Sprint 6

- [ ] Élimination détectée et affichée
- [ ] Fin de partie avec écran résultats
- [ ] Profil modifiable (nom, email, password)
- [ ] Historique des parties consultable
- [ ] Code TypeScript strict

---

## Dépendances & Risques Globaux

### Dependency Tree

```
Sprint 1: Auth (Étape 1)            ✅ Terminé
  │ (User authentifié + token)
  v
Sprint 2: Lobby & QR (Étape 2)      A démarrer
  │ (Session créée/rejointe)
  v
Sprint 3: Modération (Étape 3)      A démarrer
  │ (Partie démarrée)
  v
Sprint 4: Carte & État (Étape 4)    A démarrer
  │ (Carte affichée)
  v
Sprint 5: Actions de jeu (Étape 5)  A démarrer
  │ (Jeu fonctionnel)
  v
Sprint 6: Fin & Profil (Étapes 5bis+6)  A démarrer
```

### Risques Globaux

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|-----------|
| API server down | Basse | Critique | Tester les endpoints dès le début de chaque sprint |
| Rate limit breach (>20 req/min) | Basse | Haut | Polling 30s strict, monitorer |
| Camera permission refusée | Moyenne | Moyen | Permettre saisie manuelle du code |
| Grille trop grande pour FlatList | Basse | Moyen | Virtualisation, cellules légères |
| Manque de temps | Haute | Haut | Prioriser qualité > quantité (consigne) |

### Cross-Sprint Dependencies

- **Token Management** : Sprint 1 -> utilisé dans tous les appels API (Sprints 2-6)
- **User State** : Sprint 1 -> utilisé dans Sprints 2-6 (creator checks, player identification)
- **Session State** : Sprint 2 -> utilisé dans Sprints 3-5 (modération, game init)
- **Game State** : Sprint 4 -> utilisé dans Sprints 5-6 (actions, fin de partie)
- **usePolling** : Sprint 2 -> réutilisé dans Sprint 5 (polling état de jeu)

---

## Backlog Bonus

**Post-MVP (si temps disponible après Sprint 6)** :

### Bonus 1 : Refresh Token (2-3h)
- Interceptor 401 -> appel refresh token -> retry requête initiale
- Si refresh échoue -> logout
- Étend la session au-delà de 24h

### Bonus 2 : Retour haptique & vibrations (1-2h)
- Haptic feedback sur validation du tour
- Vibration quand un vaisseau est détruit
- `expo-haptics`

---

## Communication API

- **Base URL** : `https://space-conquest-online.osc-fr1.scalingo.io/api`
- **Documentation** : `https://space-conquest-online.osc-fr1.scalingo.io/api/documentation`
- **Rate limit** : 20 req/min global
- **Polling** : 30s minimum
- **Auth** : Bearer token dans header Authorization
- **Content-Type** : application/json
