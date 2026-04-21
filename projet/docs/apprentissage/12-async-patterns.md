# Chapitre 12 — Patterns de données asynchrones

[← Composition](11-composition.md) | [Index](README.md) | [Suivant : React Native core →](13-react-native-core.md)

---

## Le trio classique : loading / error / data

Chaque appel API suit le même cycle :

```
idle → loading → (success: data) OU (error: message) → idle
```

Dans ton code, ce pattern est **systématique**. Exemple [useGame.ts:29-41](../../src/features/game/hooks/useGame.ts#L29-L41) :

```tsx
const loadMap = useCallback(async () => {
  if (!state.sessionId) return;
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const map = await gameService.getGameMap(state.sessionId);
    dispatch({ type: 'SET_MAP', payload: map });
    dispatch({ type: 'SET_ERROR', payload: null });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: getErrorMessage(error) });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}, [dispatch, state.sessionId]);
```

Le `finally` est crucial : il garantit que `loading` repasse à `false` **quoi qu'il arrive**.

## Le pattern "result typé"

[useLobby.ts:14-27](../../src/features/lobby/hooks/useLobby.ts#L14-L27) retourne `{ success: true } | { success: false, error: string }`. C'est une **union discriminée** : le code appelant est forcé de vérifier `success` avant de lire `error`. Zero runtime crash.

```tsx
const result = await createSession(name);
if (result.success) {
  // ici result est { success: true }
} else {
  // ici result est { success: false, error: string }
  showToast(result.error);
}
```

## Le polling

Ton `usePolling` est un cas particulier d'async : on répète le fetch toutes les 30s. Ce qui en fait un bon hook :

- **Re-run automatique** d'un callback.
- **Pause** quand l'app est en arrière-plan.
- **Circuit breaker** sur 10 erreurs consécutives.
- **Protection** contre les requêtes concurrentes.

Tu l'utilises dans `useModeration` et `SessionDetailScreen` pour rafraîchir la liste des joueurs sans websocket.

## Questions pour la soutenance

- Pourquoi le pattern try/catch/finally ?
- Pourquoi retourner `{ success, error }` plutôt que de throw ?
- Qu'est-ce qu'un "circuit breaker" et pourquoi ton polling en a un ?
