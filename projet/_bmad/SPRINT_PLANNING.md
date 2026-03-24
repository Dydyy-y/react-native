# Sprint Planning & Roadmap

**Date** : 23 mars 2026  
**Sprint Duration** : 4 semaines (jusqu'au 07 avril 2026 - date rendu)  
**Team** : Individuel  
**Status** : Sprint 1 - Initial Planning

---

## 1. Overview

Ce document récapitule le planning du sprint basé sur les 4 épiques du cahier des charges de "Space Conquest Online".

---

## 2. Sprint Backlog

### Épic 1 : Inscription & Connexion ⭐ PRIORITÉ 1
**Estimate** : 13 points (3-4 jours)  
**Status** : À développer

**Dépendances** : Aucune (point départ)  
**Blockers** : Aucun

**User Stories** :
- [ ] US 1.1 - Sign Up screen + register API
- [ ] US 1.2 - Sign In screen + login API + secure storage
- [ ] US 1.3 - Protected navigation & token management

**Acceptance Criteria** : Voir [PRD_EPIC1_AUTH.md](PRD_EPIC1_AUTH.md)

**Definition of Done** :
- Code TypeScript ✓
- All acceptance tests pass ✓
- Secure token storage ✓
- Error handling ✓

---

### Épic 2 : Lobby & QR Code ⭐ PRIORITÉ 2
**Estimate** : 21 points (5-6 jours)  
**Status** : À développer

**Dépendances** : Épic 1 terminé (besoin user authentifié)  
**Blockers** : Aucun une fois Épic 1 done

**User Stories** :
- [ ] US 2.1 - Create session + QR generation
- [ ] US 2.2 - Join session + QR scanner
- [ ] US 2.3 - Lobby polling (30s interval)
- [ ] US 2.4 - Leave session

**Acceptance Criteria** : Voir [PRD_EPIC2_LOBBY.md](PRD_EPIC2_LOBBY.md)

**Definition of Done** :
- Polling implémenté ✓
- QR code scannable ✓
- List updates smooth ✓
- Rate limit respecté ✓

---

### Épic 3 : Modération & Start ⭐ PRIORITÉ 3
**Estimate** : 13 points (3-4 jours)  
**Status** : À développer

**Dépendances** : Épic 2 terminé (besoin lobby fonctionnel)  
**Blockers** : Aucun une fois Épic 2 done

**User Stories** :
- [ ] US 3.1 - Kick & Ban players (creator only)
- [ ] US 3.2 - Delete session
- [ ] US 3.3 - Start game

**Acceptance Criteria** : Voir [PRD_EPIC3_MODERATION.md](PRD_EPIC3_MODERATION.md)

**Definition of Done** :
- Confirmation modales ✓
- Creator-only permissions ✓
- Auto-navigation trigger ✓

---

### Épic 4 : Game Map & State ⭐ PRIORITÉ 4
**Estimate** : 13 points (3-4 jours)  
**Status** : À développer

**Dépendances** : Épic 3 terminé (besoin game lancé)  
**Blockers** : Aucun une fois Épic 3 done

**User Stories** :
- [ ] US 4.1 - Display game map (grid + resources + ships)
- [ ] US 4.2 - Display player state (resources, round, stats)
- [ ] US 4.3 - Error handling & retry logic

**Acceptance Criteria** : Voir [PRD_EPIC4_GAME.md](PRD_EPIC4_GAME.md)

**Definition of Done** :
- Map fully responsive ✓
- All stats displayed ✓
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

