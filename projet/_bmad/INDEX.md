# Space Conquest Online - Documentation Index

**Version** : 1.1  
**Date** : 24 mars 2026  
**Status** : Sprint Planning + Architecture Exploration

---

## 📋 Vue d'ensemble rapide

Vous avez **9 documents de planification détaillés** :

### 🆕 NOUVEAUX : Exploration Architecturale

```
⭐ DECISION_GUIDE.md      → PAR OÙ COMMENCER (lisez d'abord!)
├─ 7 questions pour choisir votre architecture
├─ Arbre de décision
├─ Recommandation finale
└─ Check-list avant de coder

ARCHITECTURE_OPTIONS.md  → 3 options d'architecture complètes
├─ OPTION A : Context API + Services
├─ OPTION B : Zustand + Services (RECOMMANDÉ ⭐)
├─ OPTION C : Feature-Folder + Zustand
├─ Matrices de comparaison
└─ Timeline par option

ARCHITECTURE_DIAGRAMS.md → Visualisations & exemples
├─ Data flow pour chaque option
├─ Comparaison re-render behavior
├─ Code review perspective
└─ Timeline détaillée

ARCHITECTURE_CODE_COMPARISON.md → Exemples de code concrets
├─ Context API (185 lignes de boilerplate)
├─ Zustand (30 lignes)
├─ Comparaison directe
└─ Cas où choisir quoi

IMPLEMENTATION_GUIDE.md → Pas à pas démarrage
├─ Setup initial (npm install, dossiers)
├─ Créer premier store/context
├─ Créer premier service
├─ Créer première screen
├─ Configurer navigation
└─ Erreurs courantes à éviter
```

### 📋 ORIGINAUX : Planification du Sprint

```

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

## 🎯 PAR OÙ COMMENCER ? (NOUVEAU - DÉCISION ARCHITECTURALE)

### 🚀 **Avant de Coder Quoi que Ce Soit**

**Le chemin recommandé (20 minutes)** :

1. **Lisez** [DECISION_GUIDE.md](DECISION_GUIDE.md) (5 min)
   → 7 questions pour décider entre 3 architectures
   → Recommendation finale

2. **Explorez** [ARCHITECTURE_OPTIONS.md](ARCHITECTURE_OPTIONS.md) (10 min)
   → Vue d'ensemble des 3 options
   → Matrices de comparaison

3. **Regardez** [ARCHITECTURE_CODE_COMPARISON.md](ARCHITECTURE_CODE_COMPARISON.md) (5 min)
   → Code concrets : Context API vs Zustand
   → Boilerplate réel

4. **Exécutez** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
   → Pas à pas : setup → premier store → première screen

---

### 📚 Chemins Thématiques

#### Chemin A : "Je veux choisir rapidement"
```
1. DECISION_GUIDE.md (5 min)
   → Réponds aux 7 questions
   → Regarde l'arbre de décision
   
2. IMPLEMENTATION_GUIDE.md (30 min)
   → Exécute les commandes Setup Étape 1
   
3. CODE: Go !
```

#### Chemin B : "Je veux comprendre les options en détail"
```
1. ARCHITECTURE_OPTIONS.md (15 min)
   → Lis les 3 options complètement
   
2. ARCHITECTURE_DIAGRAMS.md (10 min)
   → Visualisations, data flows
   
3. ARCHITECTURE_CODE_COMPARISON.md (10 min)
   → Exemples concrets de code
   
4. DECISION_GUIDE.md (5 min)
   → Finalise ton choix
   
5. IMPLEMENTATION_GUIDE.md (30 min)
   → Setup + premier store
   
6. CODE: Go !
```

#### Chemin C : "Je sais déjà ce que je veux (Context API)"
```
1. ARCHITECTURE.md (45 min) ← Original doc
   → Comprendre la structure proposée
   
2. SPRINT_PLANNING.md (20 min)
   → Timeline et dépendances
   
3. IMPLEMENTATION_GUIDE.md (Option A section)
   → Pas à pas pour Context API
   
4. PRD_EPIC1_AUTH.md
   → Commencer par l'authentification
   
5. CODE: Go !
```

#### Chemin D : "Je veux la meilleure solution pour moi (RECOMMANDÉ)"
```
→ Suivez exactement le "Chemin A" ci-dessus
→ Notre recommendation : Zustand + Feature Layout
→ Vous gagnez 1-2 jours de développement
→ Code plus lisible et maintenable
```

---

## 🚀 Original Path (Si vous ignorer les décisions architecturales)

### 1️⃣ **Si vous êtes PM** (Product Manager)
Lisez dans cet ordre :
1. [SPRINT_PLANNING.md](SPRINT_PLANNING.md) - Vue d'ensemble timeline
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Section 1-3 (navigation, state mgmt)
3. Chaque PRD pour détails métier (dans l'ordre épiques)

---

### 2️⃣ **Si vous êtes DEV** (Developer)
Lisez dans cet ordre :
1. **NEW** → [DECISION_GUIDE.md](DECISION_GUIDE.md) - Choisir l'architecture
2. [ARCHITECTURE.md](ARCHITECTURE.md) - COMPLÈTEMENT (structure, services, types)
3. **NEW** → [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Setup et code
4. [SPRINT_PLANNING.md](SPRINT_PLANNING.md) - Section 5-7 (dépendances, standards)
5. [PRD_EPIC1_AUTH.md](PRD_EPIC1_AUTH.md) - Section 4 (technical details)
6. Chaque épique PRD dans l'ordre (1 → 2 → 3 → 4)

---

### 3️⃣ **Si vous avez 15 minutes** ⏱️
Lisez seulement :
1. [DECISION_GUIDE.md](DECISION_GUIDE.md) - Décider en 5 min
2. [SPRINT_PLANNING.md](SPRINT_PLANNING.md) - Sections 1-3 (Overview + Backlog)
3. [ARCHITECTURE.md](ARCHITECTURE.md) - Section 1 (Vue d'ensemble visuelle)

---

## 📚 Structure Complète des Documents

### 🆕 ARCHITECTURE DECISION DOCUMENTS

#### DECISION_GUIDE.md
**Longueur** : ~250 lignes  
**Score** : ⭐⭐⭐⭐⭐ (LISEZ CECI EN PREMIER)  
**Contenu** :
- 7 questions pour décider
- Arbre de décision
- Recommandation finale
- Check-list avant coding

---

#### ARCHITECTURE_OPTIONS.md
**Longueur** : ~450 lignes  
**Score** : ⭐⭐⭐⭐⭐ (COMPRENEZ LES OPTIONS)  
**Contenu** :
- OPTION A : Context API (35h)
- OPTION B : Zustand (20h) ← RECOMMANDÉ
- OPTION C : Feature-Folder (24h)
- Matrices de comparaison
- Avantages/inconvénients détaillés

---

#### ARCHITECTURE_DIAGRAMS.md
**Longueur** : ~400 lignes  
**Score** : ⭐⭐⭐⭐ (VISUALISEZ LES ARCHITECTURES)  
**Contenu** :
- Data flow diagrams
- Boilerplate size comparisons
- Re-render behavior
- Code review perspectives
- Timeline par option

---

#### ARCHITECTURE_CODE_COMPARISON.md
**Longueur** : ~350 lignes  
**Score** : ⭐⭐⭐⭐ (VOYEZ LE CODE RÉEL)  
**Contenu** :
- AuthStore en Context (235 lignes boilerplate)
- AuthStore en Zustand (30 lignes)
- Utilisation dans les composants
- Comparaison directe
- 4 stores : Context (1140 L) vs Zustand (120 L)

---

#### IMPLEMENTATION_GUIDE.md
**Longueur** : ~600 lignes  
**Score** : ⭐⭐⭐⭐⭐ (DÉMARREZ ICI POUR CODER)  
**Contenu** :
- Installation étape par étape
- Créer premier store/context
- Créer premier service
- Créer première screen
- Configurer la navigation
- Erreurs courantes expliquées

---

### 📋 ORIGINAL DOCUMENTS

#### ARCHITECTURE.md
**Longueur** : ~450 lignes  
**Score** : ⭐⭐⭐⭐⭐ (RÉFÉRENCE COMPLÈTE)  
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

**Note** : Peut être mise à jour avec votre architecture finale (Context, Zustand, ou Feature-Folder)

---

#### SPRINT_PLANNING.md
**Longueur** : ~300 lignes  
**Score** : ⭐⭐⭐⭐
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

