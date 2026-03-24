# Space Conquest Online - Documentation Index

**Version** : 1.0  
**Date** : 23 mars 2026  
**Status** : Sprint Planning Complete

---

## 📋 Vue d'ensemble rapide

Vous avez 5 documents de planification détaillés :

```
ARCHITECTURE.md          → Design système complet
├─ Structure du projet
├─ Navigation
├─ Gestion d'état (Context API)
├─ Services API
└─ Types TypeScript

SPRINT_PLANNING.md       → Roadmap 4 semaines
├─ Timeline jour par jour
├─ Dépendances épiques 
├─ Ressources requises
└─ Checkliste submission

PRD_EPIC1_AUTH.md        → Inscription & Connexion
├─ US 1.1 : Sign Up
├─ US 1.2 : Sign In
└─ US 1.3 : Protected Navigation

PRD_EPIC2_LOBBY.md       → Salon d'attente & QR
├─ US 2.1 : Create Session + QR
├─ US 2.2 : Join via QR Scanner
├─ US 2.3 : Lobby Polling (30s)
└─ US 2.4 : Leave Session

PRD_EPIC3_MODERATION.md  → Contrôle & Démarrage
├─ US 3.1 : Kick & Ban Players
├─ US 3.2 : Delete Session
└─ US 3.3 : Start Game

PRD_EPIC4_GAME.md        → Jeu & État
├─ US 4.1 : Display Map (grille)
├─ US 4.2 : Display Player State
└─ US 4.3 : Error Handling
```

---

## 🚀 Par où commencer ?

### 1️⃣ **Si vous êtes PM** (Product Manager)
Lisez dans cet ordre :
1. [SPRINT_PLANNING.md](SPRINT_PLANNING.md) - Vue d'ensemble timeline
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Section 1-3 (navigation, state mgmt)
3. Chaque PRD pour détails métier (dans l'ordre épiques)

---

### 2️⃣ **Si vous êtes DEV** (Developer)
Lisez dans cet ordre :
1. [ARCHITECTURE.md](ARCHITECTURE.md) - COMPLÈTEMENT (structure, services, types)
2. [SPRINT_PLANNING.md](SPRINT_PLANNING.md) - Section 5-7 (dépendances, standards)
3. [PRD_EPIC1_AUTH.md](PRD_EPIC1_AUTH.md) - Section 4 (technical details)
4. Chaque épique PRD dans l'ordre (1 → 2 → 3 → 4)

---

### 3️⃣ **Si vous avez 15 minutes** ⏱️
Lisez seulement :
1. Ce fichier (vous êtes ici)
2. [SPRINT_PLANNING.md](SPRINT_PLANNING.md) - Sections 1-3 (Overview + Backlog)
3. [ARCHITECTURE.md](ARCHITECTURE.md) - Section 1 (Vue d'ensemble visuelle)

---

## 📚 Structure des Documents

### ARCHITECTURE.md
**Quoi** : Design système complet  
**Longueur** : ~350 lignes  
**Sections** :
- Vue d'ensemble visuelle
- Structure des dossiers (folder tree)
- Gestion d'état (4 contexts : Auth, Lobby, Game, UI)
- Navigation (Root + Auth + App stacks)
- Flux de données (auth, lobby, game)
- Services API
- Storage sécurisé
- Stratégie polling
- Types TypeScript clés
- Bonnes pratiques

**Score** : ⭐⭐⭐⭐⭐ (fondamental pour les devs)

---

### SPRINT_PLANNING.md
**Quoi** : Planification exécutive du sprint  
**Longueur** : ~300 lignes  
**Sections** :
- Overview
- Sprint backlog (4 épiques résumées)
- Timeline semaine par semaine
- Dépendances d'implémentation
- Ressources NPM requises
- Références à ARCHITECTURE.md
- Standards & best practices
- Risks & mitigation
- Bonus features
- Démarrage du développement (step-by-step)
- Checkliste final submission

**Score** : ⭐⭐⭐⭐⭐ (crucial pour gestion du temps)

---

### PRD_EPIC1_AUTH.md
**Quoi** : Spécification complète Inscription & Connexion  
**Longueur** : ~280 lignes  
**Sections** :
- Objectif business + success metrics
- 3 User Stories détaillées
  - US 1.1 : Sign Up
  - US 1.2 : Sign In
  - US 1.3 : Protected Navigation
- Acceptance Tests (tableau)
- Technical Details (Context, Services, Hooks, Endpoints)
- UI/UX Guidelines
- Definition of Done

**Score** : ⭐⭐⭐⭐⭐ (démarrage du développement)

---

### PRD_EPIC2_LOBBY.md
**Quoi** : Spécification Lobby & QR Code  
**Longueur** : ~340 lignes  
**Sections** :
- Objectif business + success metrics
- 4 User Stories détaillées
  - US 2.1 : Create Session + QR
  - US 2.2 : Join via QR Scanner
  - US 2.3 : Lobby Polling (30s)
  - US 2.4 : Leave Session
- Acceptance Tests (13 tests)
- Technical Details (Context, Services, Hooks)
- **Polling Implementation Strategy** (pattern réutilisable)
- UI/UX Guidelines
- Definition of Done

**Score** : ⭐⭐⭐⭐⭐ (clé : polling + QR)

---

### PRD_EPIC3_MODERATION.md
**Quoi** : Spécification Contrôle & Démarrage  
**Longueur** : ~240 lignes  
**Sections** :
- Objectif business + success metrics
- 3 User Stories détaillées
  - US 3.1 : Kick & Ban Players
  - US 3.2 : Delete Session
  - US 3.3 : Start Game
- Acceptance Tests (13 tests)
- Technical Details (Components, Services, Endpoints)
- Error Handling
- UI/UX Guidelines
- Definition of Done

**Score** : ⭐⭐⭐⭐ (modération creator-only)

---

### PRD_EPIC4_GAME.md
**Quoi** : Spécification Carte & État  
**Longueur** : ~320 lignes  
**Sections** :
- Objectif business + success metrics
- 3 User Stories détaillées
  - US 4.1 : Display Game Map (grille)
  - US 4.2 : Display Player State (stats)
  - US 4.3 : Error Handling & Retry
- Acceptance Tests (14 tests)
- **Technical Details** (Components détaillés, GameContext)
- Types TypeScript (Ship, GameState, etc.)
- UI/UX Guidelines (grille, responsive, feedback)
- Definition of Done
- Bonus Features (future enhancements)

**Score** : ⭐⭐⭐⭐ (clé : grille responsive)

---

## 🔗 Dépendances entre Documents

```
ARCHITECTURE.md (Base)
    ↓
    ├─→ SPRINT_PLANNING.md (Timeline + Setup)
    │       ↓
    │       └─→ PRD_EPIC1 (Setup Auth)
    │
    └─→ PRD_EPIC1_AUTH.md
            ↓
            PRD_EPIC2_LOBBY.md (Besoin user auth)
                ↓
                PRD_EPIC3_MODERATION.md (Besoin lobby running)
                    ↓
                    PRD_EPIC4_GAME.md (Besoin game started)
```

---

## ✅ Checklist Avant de Coder

Avant de commencer le développement, assurez-vous de :

- [ ] Avoir lu [ARCHITECTURE.md](ARCHITECTURE.md) complètement (surtout sections 2-5)
- [ ] Comprendre la folder structure et pourquoi c'est organisé comme ça
- [ ] Avoir noté les types TypeScript clés (User, Session, GameState, etc.)
- [ ] Comprendre les 4 Contexts : Auth, Lobby, Game, UI
- [ ] Connaître les endpoints API à utiliser pour chaque épique
- [ ] Avoir noté les contraintes API (rate limit 20 req/min, polling 30s, etc.)
- [ ] Avoir listé les dépendances NPM requises
- [ ] Bloquer du temps selon [SPRINT_PLANNING.md](SPRINT_PLANNING.md) (4 semaines max)
- [ ] Être sur d'avoir compris les acceptance criteria de chaque User Story

---

## 🎯 Tableau Récapitulatif

| Épic | User Stories | Estimate | Priorité | Blockers |
|------|--------------|----------|----------|----------|
| 1 Auth | 3 | 13pt (3-4j) | ⭐⭐⭐⭐⭐ | Aucun |
| 2 Lobby | 4 | 21pt (5-6j) | ⭐⭐⭐⭐⭐ | Épic 1 |
| 3 Moderation | 3 | 13pt (3-4j) | ⭐⭐⭐⭐⭐ | Épic 2 |
| 4 Game | 3 | 13pt (3-4j) | ⭐⭐⭐⭐⭐ | Épic 3 |
| **TOTAL** | **13** | **60pt** | **4 semaines** | **None if ordered** |

---

## 📖 Glossaire

- **Context** : React Context pour état global
- **Reducer** : Pattern pour gérer état complexe
- **Hook** : Fonction React pour encapsuler logique
- **Service** : Classe/module pour appels API
- **Polling** : Requêtes HTTP périodiques (ex : toutes les 30s)
- **QR Code** : Code visuel pour invitation session
- **Epic** : Grand feature couvrant plusieurs User Stories
- **User Story** : Fonctionnalité spécifique pour un user
- **Acceptance Criteria** : Conditions de succès d'une US
- **Rate Limit** : Limite requêtes API (20 req/min)

---

## 🔐 Points de Sécurité Clés

1. **Token Storage** : SecureStore (pas localStorage)
2. **401 Handling** : Auto-logout + redirection
3. **Headers** : Authorization: Bearer {token}
4. **Validation** : Client-side + Server-side
5. **No Hardcoding** : Pas de tokens en code
6. **No Console Logs** : Pas de données sensibles en logs

---

## 🚨 Points d'Attention Critiques

⚠️ **Rate Limit API** : Max 20 requêtes/minute globalement
⚠️ **Polling Interval** : 30 secondes minimum pour lobby
⚠️ **QR Code Format** : À récupérer de la API response
⚠️ **State Transitions** : Utilisateur peut être kicked/banned/session supprimée à tout moment
⚠️ **Responsive Design** : Tester sur petits écrans pour la carte

---

## 📞 Questions Récurrentes

**Q: Par où je commence ?**  
A: [ARCHITECTURE.md](ARCHITECTURE.md) section 1, puis [PRD_EPIC1_AUTH.md](PRD_EPIC1_AUTH.md)

**Q: Combien de temps pour chaque épic ?**  
A: 3-6 jours. Voir [SPRINT_PLANNING.md](SPRINT_PLANNING.md) section 3

**Q: Dois-je utiliser Redux ?**  
A: Non. Context API + useReducer suffisent.

**Q: Comment gérer le polling sans tuer la batterie ?**  
A: 30s interval minimum, arrêter quand screen unmounted

**Q: Onde stocker les tokens ?**  
A: expo-secure-store (SecureStore)

**Q: Est-ce que je peux utiliser [Bibliothèque X] ?**  
A: Non IA (Anthropic, OpenAI) pour gen de code. React Native + Expo obligatoires. TypeScript obligatoire.

---

## 📊 Progression Tracking

Utilisez cette todo list pour tracker :

```markdown
## Épic 1 : Auth
- [ ] US 1.1 Sign Up
- [ ] US 1.2 Sign In
- [ ] US 1.3 Protected Navigation

## Épic 2 : Lobby
- [ ] US 2.1 Create + QR
- [ ] US 2.2 Join + Scanner
- [ ] US 2.3 Polling
- [ ] US 2.4 Leave

## Épic 3 : Moderation
- [ ] US 3.1 Kick & Ban
- [ ] US 3.2 Delete
- [ ] US 3.3 Start Game

## Épic 4 : Game
- [ ] US 4.1 Map Display
- [ ] US 4.2 Player State
- [ ] US 4.3 Error Handling

## Polish
- [ ] Code review
- [ ] Tests edge cases
- [ ] Deploy to GitHub
```

---

## 🎓 Ressources Externes

- **API Docs** : https://space-conquest-online.osc-fr1.scalingo.io/api/documentation
- **React Navigation** : https://reactnavigation.org/
- **React Native** : https://reactnative.dev/
- **Expo** : https://docs.expo.dev/
- **TypeScript** : https://www.typescriptlang.org/

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 23 mar 2026 | Initial documentation complete |

---

## 🤝 Next Steps

Après avoir lu ce document et les PRDs :

1. **Setup projet** : `npx create-expo-app@latest`
2. **Installer dépendances** : Voir [SPRINT_PLANNING.md](SPRINT_PLANNING.md) section 5
3. **Créer folder structure** : Voir [ARCHITECTURE.md](ARCHITECTURE.md) section 2
4. **Démarrer Épic 1** : Auth screens + context
5. **Commit** : Petit chunks (commit par feature)
6. **Push** : GitHub régulièrement

---

**Fin du Document Index**

Pour toute question, relisez les sections "Technical Details" des PRDs appropriés.

