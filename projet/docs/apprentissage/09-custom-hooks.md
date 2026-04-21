# Chapitre 9 — Custom hooks

[← useReducer](08-usereducer.md) | [Index](README.md) | [Suivant : useMemo/useCallback/useRef →](10-usememo-usecallback-useref.md)

---

## Concept

Un **custom hook** est juste une **fonction qui commence par `use`** et qui peut utiliser d'autres hooks. C'est le mécanisme de **réutilisation de logique** en React (pas de logique, pas de JSX — la logique va dans les hooks, le JSX dans les composants).

## Pourquoi faire ses propres hooks ?

- Factoriser du code répétitif (loading/error/data).
- Séparer la logique du rendu (principe "single responsibility").
- Réutiliser entre plusieurs écrans.

## Ton hook le plus simple — `useLogin`

[useLogin.ts](../../src/features/auth/hooks/useLogin.ts) :

```tsx
export const useLogin = (): UseLoginReturn => {
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(false);

  const execute = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await login(email, password);
      await saveToken(response.access_token);
      dispatch({ type: 'SET_TOKEN', payload: response.access_token });
      const user = await getProfile();
      dispatch({ type: 'SET_USER', payload: user });
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  return { loading, execute };
};
```

**Ce qu'il fait :**
1. Expose un état local (`loading`).
2. Expose une action (`execute`).
3. Utilise un autre hook (`useAuth`) pour dispatcher.
4. Retourne ce dont l'écran a besoin — rien d'autre.

**L'écran devient trivial :**

```tsx
const { loading, execute } = useLogin();
const handleSubmit = async () => {
  const result = await execute(email, password);
  if (!result.success) showToast(result.error);
};
```

## Ton hook le plus subtil — `usePolling`

[usePolling.ts](../../src/shared/hooks/usePolling.ts) mérite une lecture attentive. Il combine :

- `useRef` pour garder une référence stable au callback (on verra pourquoi).
- `useEffect` pour gérer le cycle de vie du timer.
- `AppState` pour pauser quand l'app est en arrière-plan.
- Un mécanisme de **circuit breaker** (arrêt après N échecs).

**Point crucial — pourquoi la ref ?**

```tsx
const callbackRef = useRef(callback);
callbackRef.current = callback;   // mis à jour à chaque render

useEffect(() => {
  const timer = setInterval(() => {
    callbackRef.current();   // ← appelle TOUJOURS la dernière version
  }, safeInterval);
  return () => clearInterval(timer);
}, [safeInterval]);           // ← pas de `callback` dans les deps !
```

Sans la ref, il faudrait mettre `callback` dans les dependencies de `useEffect` → à chaque render, l'effet recréerait le timer → polling relancé en permanence. La ref permet de **capturer le callback le plus récent** sans forcer un cleanup/re-setup.

## Règles des hooks (strictes, imposées par React)

1. **Toujours appeler les hooks au top level** du composant ou d'un autre hook.
2. **Jamais dans un if, une boucle, une fonction imbriquée.**

```tsx
// ❌ MAUVAIS
if (condition) {
  const [x, setX] = useState(0);
}

// ✅ BON
const [x, setX] = useState(0);
if (condition) { /* ... */ }
```

Raison : React identifie les hooks par leur **ordre d'appel**. Si l'ordre change entre deux renders, React mélange les états.

## Questions pour la soutenance

- Quelle est la différence entre `useLogin` et `useLobby` en termes de design ?
- Pourquoi `usePolling` utilise une ref pour le callback ?
- Qu'est-ce que les "règles des hooks" ? Pourquoi elles existent ?
