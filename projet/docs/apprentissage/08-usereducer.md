# Chapitre 8 — `useReducer`

[← Context API](07-context-api.md) | [Index](README.md) | [Suivant : Custom hooks →](09-custom-hooks.md)

---

## Problème que ça résout

Quand ton state a **plusieurs sous-champs** qui évoluent de façon coordonnée (login → setLoading(true) → setUser(...) → setToken(...) → setLoading(false)), `useState` multiplie les setters et rend les transitions difficiles à suivre.

`useReducer` centralise toutes les transitions d'état dans une **fonction pure** : le **reducer**.

## Anatomie d'un reducer

Le reducer prend `(state, action)` et retourne un **nouveau** state. Il ne doit **JAMAIS** muter ou faire d'effet de bord (fetch, setTimeout, etc.).

[AuthContext.tsx:40-59](../../src/features/auth/contexts/AuthContext.tsx#L40-L59) :

```tsx
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_AUTH':
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { ...state, user: null, token: null, error: null };
    default:
      return state;
  }
};
```

## Les "Action" typées en TypeScript — Discriminated Union

[AuthContext.tsx:24-31](../../src/features/auth/contexts/AuthContext.tsx#L24-L31) :

```tsx
type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }                    // ← pas de payload
  | { type: 'CLEAR_ERROR' };
```

C'est une **union discriminée** : le champ `type` permet à TypeScript d'inférer automatiquement le type du `payload` dans chaque `case` du reducer.

```tsx
case 'SET_AUTH':
  return { ...state, user: action.payload.user, token: action.payload.token };
  //                       ^^^^^^^^^^^^^^^^^^^^^
  //                       TS sait que payload est { user: User; token: string }
```

Si tu dispatches `{ type: 'LOGOUT', payload: ... }` → erreur de compilation (LOGOUT n'a pas de payload). **C'est exactement ce qu'on veut.**

## Dispatch dans le composant

```tsx
const [state, dispatch] = useReducer(authReducer, initialState);
dispatch({ type: 'SET_LOADING', payload: true });
```

## `useState` vs `useReducer` : quand choisir ?

| Critère | useState | useReducer |
|---------|----------|------------|
| State simple (1-2 valeurs) | ✅ | overkill |
| Transitions complexes | ⚠️ boilerplate | ✅ |
| Plusieurs champs liés | ⚠️ | ✅ |
| Besoin de log/debug | difficile | ✅ (reducer = fonction pure testable) |

Dans ton projet, `AuthContext`, `LobbyContext`, `GameContext` utilisent `useReducer` parce qu'ils ont chacun **5-10 champs et autant de transitions**. `useState` pour chacun serait ingérable.

## Les effets de bord ne sont PAS dans le reducer

Le reducer met seulement à jour l'état en mémoire. **Les appels API sont dans les hooks** :

- [useLobby.ts:14-27](../../src/features/lobby/hooks/useLobby.ts#L14-L27) fait l'appel API **puis** dispatch.
- Le reducer reçoit juste le résultat.

C'est la séparation **fetch (dans les hooks/services) vs transition d'état (dans le reducer)**. Principe fondamental.

## Questions pour la soutenance

- Qu'est-ce qu'une fonction pure ? Pourquoi le reducer doit en être une ?
- Pourquoi `useReducer` plutôt que 10 `useState` dans `AuthContext` ?
- Qu'est-ce qu'une union discriminée en TypeScript ? Pourquoi c'est puissant ici ?
