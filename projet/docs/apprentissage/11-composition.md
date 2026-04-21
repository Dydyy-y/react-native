# Chapitre 11 — Composition & séparation des responsabilités

[← useMemo/useCallback/useRef](10-usememo-usecallback-useref.md) | [Index](README.md) | [Suivant : Async patterns →](12-async-patterns.md)

---

## La règle qui guide ton projet

Quatre couches, chacune a **une seule responsabilité** :

```
┌─────────────────────────────────────────────────────┐
│ Screens   → JSX, navigation, interactions           │  (UI)
│ Hooks     → state + actions + orchestration         │  (logique réutilisable)
│ Services  → appels HTTP bruts (axios)               │  (I/O)
│ Contexts  → état global partagé                     │  (state)
└─────────────────────────────────────────────────────┘
```

## Exemple concret : le flux "login"

1. **Screen** [LoginScreen.tsx](../../src/features/auth/screens/LoginScreen.tsx) : affiche les inputs, gère le state local des champs, appelle `useLogin().execute()`.
2. **Hook** [useLogin.ts](../../src/features/auth/hooks/useLogin.ts) : orchestre login → save token → get profile → dispatch.
3. **Service** [authService.ts](../../src/features/auth/services/authService.ts) : `axios.post('/auth/login', ...)`.
4. **Context** [AuthContext.tsx](../../src/features/auth/contexts/AuthContext.tsx) : stocke `user` et `token` dans le state global.

## Composants "présentationnels" vs "containers"

Un **composant présentationnel** ne connaît pas l'état global. Il reçoit tout en props et appelle des callbacks.

[MapCell.tsx](../../src/features/game/components/MapCell.tsx) est **purement présentationnel** : il ne sait rien du jeu, il affiche une case selon les props reçues.

[GameScreen.tsx](../../src/features/game/screens/GameScreen.tsx) est un **container** : il utilise `useGame()`, orchestre, et distribue les données aux composants enfants.

**Avantage** : les composants présentationnels sont **testables isolément** et **réutilisables**. `MapCell` pourrait afficher une case de n'importe quelle carte.

## Imports via `index.ts`

Convention dans ton projet : [src/features/auth/index.ts](../../src/features/auth/index.ts) ré-exporte ce qui est public. Les autres features importent **depuis la feature**, pas depuis ses sous-dossiers :

```tsx
// ✅
import { useAuth, ProfileScreen } from '../features/auth';

// ❌
import { useAuth } from '../features/auth/contexts/AuthContext';
```

Ça rend la **surface publique** de chaque feature explicite. On peut refactorer les internals sans casser les importeurs.

## Questions pour la soutenance

- Qu'est-ce qu'un "container component" vs "presentational component" ?
- Pourquoi mettre l'appel API dans le hook `useLobby` et pas dans `LobbyHomeScreen` ?
- Pourquoi les imports passent-ils par `index.ts` ?
