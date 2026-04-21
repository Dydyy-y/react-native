# Chapitre 6 — Cycle de vie avec `useEffect`

[← Conditional rendering](05-conditional-rendering.md) | [Index](README.md) | [Suivant : Context API →](07-context-api.md)

---

## Concept

`useEffect` permet d'exécuter du **code externe au rendu** : appels API, timers, subscriptions, écoutes d'événements. Il s'exécute **après** que React a mis à jour le DOM/l'écran.

## Anatomie

```tsx
useEffect(() => {
  // code qui s'exécute
  return () => {
    // cleanup (optionnel) — appelé avant le prochain run ou à l'unmount
  };
}, [dep1, dep2]);  // ← dependency array
```

Le **dependency array** détermine QUAND l'effet re-tourne :
- `[]` → **une seule fois** au montage.
- `[a, b]` → à chaque fois que `a` ou `b` change.
- *Absent* → à **chaque rendu** (dangereux, rarement voulu).

## Dans ton code — montage unique

[AuthContext.tsx:90-92](../../src/features/auth/contexts/AuthContext.tsx#L90-L92) :

```tsx
useEffect(() => {
  configureApiClient(getToken, () => logoutRef.current());
}, []);  // ← [] : exécuté une fois au montage du AuthProvider
```

On configure l'Axios client une seule fois quand l'app démarre.

## Dans ton code — avec cleanup

[usePolling.ts:61-89](../../src/shared/hooks/usePolling.ts#L61-L89) :

```tsx
useEffect(() => {
  if (!enabled) { /* ... */ return; }

  const handleAppState = (nextState: AppStateStatus) => { /* ... */ };
  const subscription = AppState.addEventListener('change', handleAppState);

  tick();
  const timer = setInterval(tick, safeInterval);

  return () => {
    clearInterval(timer);           // ← cleanup du timer
    subscription.remove();          // ← cleanup du listener
  };
}, [enabled, safeInterval, tick]);
```

**La fonction retournée est le cleanup.** Elle s'exécute :
- Avant le prochain run de l'effet (si une dependency change).
- Quand le composant est démonté.

**Sans cleanup du `setInterval`**, chaque re-run créerait un nouveau timer sans tuer l'ancien → leak mémoire + multiples appels API simultanés.

## Pièges classiques

### Piège 1 : oublier une dépendance

```tsx
useEffect(() => {
  fetch(`/api/user/${userId}`);
}, []);  // ❌ userId manquant → stale closure
```

Si `userId` change, l'effet ne re-run pas → tu charges toujours le premier user.

### Piège 2 : fonction recréée à chaque render

```tsx
const doSomething = () => { /* ... */ };
useEffect(() => { doSomething(); }, [doSomething]);  // ❌ boucle infinie
```

`doSomething` est une nouvelle référence à chaque render → l'effet se relance en permanence. Solution : `useCallback` (chapitre 10) ou déplacer la fonction dans l'effet.

## Questions pour la soutenance

- À quoi sert le dependency array ?
- Quand la fonction de cleanup est-elle appelée ? (Deux cas)
- Pourquoi `useEffect(() => fetch(...), [])` est souvent faux si tu utilises des variables ?
