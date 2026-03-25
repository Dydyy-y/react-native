# Space Conquest Online - Claude Code Context

## Projet

Application mobile **React Native + Expo + TypeScript** servant de client pour le jeu de stratégie multijoueur au tour par tour "Space Conquest Online".

- **Date de rendu** : 07/04/2026 à 23h59
- **API Base URL** : `https://space-conquest-online.osc-fr1.scalingo.io/api`
- **API Docs** : `https://space-conquest-online.osc-fr1.scalingo.io/api/documentation`

## Contraintes Techniques (NON NÉGOCIABLES)

- React Native + Expo (obligatoire)
- TypeScript strict
- **Context API + useReducer UNIQUEMENT** pour la gestion d'état (pas Redux, pas Zustand)
- Axios pour les appels API
- expo-secure-store pour les tokens (stockage sécurisé)
- Polling HTTP à 30s minimum (rate limit : 20 req/min)
- TabsNavigator requis dans la navigation
- Les données de récupération API doivent être implémentées sous forme de **hooks**

## Architecture (Feature-Folder)

```
src/
├── features/
│   ├── auth/          → Authentification (login, signup, token)
│   ├── lobby/         → Sessions de jeu (create, join, QR code)
│   ├── game/          → Jeu (carte, état, actions)
│   └── ui/            → Composants UI partagés + état global UI
├── shared/
│   ├── hooks/         → useApi.ts, usePolling.ts
│   ├── utils/         → constants, validation, logger, errorHandler
│   ├── types/         → common.types.ts
│   └── config/        → apiClient.ts (Axios + interceptors)
└── navigation/        → RootNavigator, NavigationTypes
```

## État Global : 4 Contexts

| Context | Contenu |
|---------|---------|
| `AuthContext` | user, token, loading, error |
| `LobbyContext` | currentSession, players, polling |
| `GameContext` | map, gameState, ships |
| `UIContext` | toasts, modals, errors |

## Navigation

```
RootNavigator
├── SplashScreen (vérification token)
├── AuthStack (Login + SignUp)
└── AppTabs (TabsNavigator obligatoire)
    ├── LobbyTab
    ├── GameTab
    └── ProfileTab
```

## Épics et Progression

| Épic | Feature | Status |
|------|---------|--------|
| 1 | Auth (login, signup, token sécurisé) | À faire |
| 2 | Lobby (create/join session, QR code, polling) | À faire |
| 3 | Modération (kick, ban, delete, start game) | À faire |
| 4 | Jeu (carte grille, état, actions, polling) | À faire |
| 5 | Fin de partie + profil | À faire |

## Règle de Documentation (OBLIGATOIRE)

Toute décision technique importante doit être documentée dans [`docs/DECISIONS.md`](docs/DECISIONS.md).

**Quand documenter :**
- Ajout d'une nouvelle dépendance npm
- Introduction d'un nouveau pattern de code
- Changement de structure de dossiers
- Choix d'une lib plutôt qu'une autre
- Décision de sécurité
- Workaround non évident

**Format :** Contexte → Décision → Pourquoi (pas les alternatives) → Conséquences.

Le fichier `docs/DECISIONS.md` contient déjà toutes les décisions initiales documentées.

---

## Documentation BMAD

Toute la documentation de planning est dans `_bmad/` :
- [ARCHITECTURE.md](_bmad/ARCHITECTURE.md) - Architecture détaillée
- [PRD_EPIC1_AUTH.md](_bmad/PRD_EPIC1_AUTH.md) - Specs auth
- [PRD_EPIC2_LOBBY.md](_bmad/PRD_EPIC2_LOBBY.md) - Specs lobby
- [PRD_EPIC3_MODERATION.md](_bmad/PRD_EPIC3_MODERATION.md) - Specs modération
- [PRD_EPIC4_GAME.md](_bmad/PRD_EPIC4_GAME.md) - Specs jeu
- [SPRINT_PLANNING.md](_bmad/SPRINT_PLANNING.md) - Planning complet

## Agents BMAD Disponibles

Utiliser les slash commands pour invoquer les agents :

- `/bmad-pm` - Product Manager : PRDs, user stories, requirements
- `/bmad-arch` - Architecte : décisions techniques, design système
- `/bmad-dev` - Développeur : implémentation code, bugs, features
- `/bmad-sm` - Scrum Master : sprint planning, backlog, priorisation
- `/bmad-qa` - QA : tests, acceptance criteria, edge cases

## Points de Sécurité

- Tokens stockés dans `expo-secure-store` (jamais en localStorage/AsyncStorage)
- Interceptor Axios ajoute automatiquement `Authorization: Bearer {token}`
- 401 → logout automatique + redirect vers Login
- Jamais de tokens hardcodés dans le code

## Conventions de Code

- TypeScript strict (pas de `any` sauf cas exceptionnel justifié)
- Pas de logique API dans les composants → tout dans les services/hooks
- Imports depuis `features/*/index.ts` (pas depuis les sous-dossiers directement)
- Pas d'imports croisés entre features (passer par `shared/`)
- Commentaires pertinents pour logique non évidente
