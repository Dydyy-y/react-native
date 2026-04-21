# Chapitre 10 — `useMemo` / `useCallback` / `useRef`

[← Custom hooks](09-custom-hooks.md) | [Index](README.md) | [Suivant : Composition →](11-composition.md)

---

## Le problème des références

En JavaScript, à chaque render un composant crée de **nouveaux objets/fonctions** :

```tsx
const MyComponent = () => {
  const config = { timeout: 10 };  // ← nouvelle ref à chaque render
  return <Child config={config} />;
};
```

Même si le contenu est identique, `config` a une nouvelle **référence**. Donc `<Child>` est vu comme ayant des props différentes → re-render inutile.

## `useMemo` — mémoïser une valeur

Recalcule la valeur seulement si les dépendances changent.

[GameMap.tsx:48-52](../../src/features/game/components/GameMap.tsx#L48-L52) :

```tsx
const resourceSet = useMemo(() => {
  const set = new Set<string>();
  map.resource_nodes.forEach((r) => set.add(`${r.x},${r.y}`));
  return set;
}, [map.resource_nodes]);
```

Sans `useMemo`, le `Set` serait reconstruit à chaque render de `GameMap`. Avec, il est reconstruit seulement quand `map.resource_nodes` change.

## `useCallback` — mémoïser une fonction

C'est `useMemo` spécialisé pour les fonctions.

[useGame.ts:15-20](../../src/features/game/hooks/useGame.ts#L15-L20) :

```tsx
const setSessionId = useCallback(
  (id: number) => {
    dispatch({ type: 'SET_SESSION_ID', payload: id });
  },
  [dispatch],
);
```

**Pourquoi ?** Sans `useCallback`, `setSessionId` est une nouvelle fonction à chaque render de `useGame`. Si un composant enfant optimisé via `React.memo` reçoit `setSessionId` en prop → il voit une nouvelle prop → re-render.

## `useRef` — une "variable mutable" qui survit aux renders

`useRef` retourne un objet `{ current: valeur }` qui :
- **Persiste entre les renders** (contrairement à une variable locale).
- **Ne déclenche PAS de re-render** quand on modifie `.current` (contrairement à `useState`).

Trois usages dans ton code :

### 1. Référence DOM/native
Peu utilisé chez toi (focus d'inputs etc.).

### 2. Valeur "fraîche" dans une closure stable

[AuthContext.tsx:86-92](../../src/features/auth/contexts/AuthContext.tsx#L86-L92) :

```tsx
const logoutRef = useRef(logout);
logoutRef.current = logout;

useEffect(() => {
  configureApiClient(getToken, () => logoutRef.current());
}, []);
```

`configureApiClient` n'est appelé qu'**une fois**. Il capture `logoutRef` mais lit `.current` à l'utilisation → on a toujours le `logout` à jour.

### 3. Flags/compteurs sans re-render

[usePolling.ts:36-40](../../src/shared/hooks/usePolling.ts#L36-L40) :

```tsx
const isRunningRef = useRef(false);
const appActiveRef = useRef(AppState.currentState === 'active');
```

Ces flags gouvernent la logique du polling sans déclencher de re-render quand on les bascule.

## Règle d'or : NE PAS sur-optimiser

**`useMemo`/`useCallback` ont un coût** (mémoïsation, comparaison de deps). Les utiliser partout ralentit l'app.

Les utiliser **quand** :
- Le calcul est lourd (`GameMap` construit un `Set` puis un tableau de W×H cellules → légitime).
- Le résultat est passé à un composant `React.memo` (comme `MapCell`).
- Le résultat est une dépendance de `useEffect` (sinon re-run en boucle).

Sinon, **laisser tomber**. Le React de 2026 est rapide.

## Questions pour la soutenance

- Quelle est la différence entre `useState` et `useRef` ?
- Pourquoi `useCallback` est nécessaire dans `useGame.ts` ? Qu'est-ce qui se casse sans ?
- Quand NE PAS utiliser `useMemo` ?
