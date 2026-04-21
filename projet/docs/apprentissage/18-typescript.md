# Chapitre 18 — TypeScript en profondeur

[← Sécurité](17-securite.md) | [Index](README.md) | [Suivant : Pièges RN →](19-pieges-rn.md)

---

## Union types et narrowing

```tsx
type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' };

function handle(action: AuthAction) {
  if (action.type === 'SET_USER') {
    action.payload;  // TS infère User | null
  }
  // ici action.type === 'LOGOUT', TS sait qu'il n'y a pas de payload
}
```

## `as const` pour les littéraux

[useLobby.ts:19](../../src/features/lobby/hooks/useLobby.ts#L19) :

```tsx
return { success: true as const };
```

Sans `as const`, `true` est inféré comme `boolean`. Avec, il est inféré comme le **type littéral** `true`. Ça permet la discrimination :

```tsx
type Result = { success: true } | { success: false, error: string };
```

Si tu oubliais `as const`, TS inférerait `{ success: boolean }` et casserait l'union.

## Generics (vu dans `usePolling`)

```tsx
export const usePolling = (
  callback: () => Promise<void>,
  interval: number = POLLING_INTERVAL_MS,
  enabled: boolean = true,
): { consecutiveErrors: number } => { ... }
```

Pas de generic ici, mais si tu voulais rendre `callback` typé sur son retour :

```tsx
export const usePolling = <T>(
  callback: () => Promise<T>,
): { consecutiveErrors: number; lastResult: T | null } => { ... }
```

## `ReactNode` — le type "n'importe quoi qui peut être rendu"

```tsx
({ children }: { children: ReactNode }) => ...
```

`ReactNode` = string | number | JSX | array de ReactNode | null | undefined. C'est le type le plus permissif pour `children`.

## Questions pour la soutenance

- Qu'est-ce qu'un type littéral ? Pourquoi `as const` ?
- Qu'est-ce qu'une union discriminée ?
- Pourquoi typer `children: ReactNode` plutôt que `children: JSX.Element` ?
