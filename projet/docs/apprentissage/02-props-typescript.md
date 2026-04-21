# Chapitre 2 — Props & TypeScript

[← JSX & composants](01-jsx-composants.md) | [Index](README.md) | [Suivant : useState →](03-usestate.md)

---

## Concept

Les **props** (properties) sont les arguments que tu passes à un composant. En React, les props sont **immuables** du point de vue de l'enfant : un composant ne doit jamais modifier ses propres props.

## Dans ton code

[MapCell.tsx:7-17](../../src/features/game/components/MapCell.tsx#L7-L17) :

```tsx
interface MapCellProps {
  x: number;
  y: number;
  size: number;
  hasResource: boolean;
  ships: Ship[];
  inRange: boolean;
  isSelected: boolean;
  onPress: (x: number, y: number) => void;   // ← callback
}

export const MapCell = memo(
  ({ x, y, size, hasResource, ships, inRange, isSelected, onPress }: MapCellProps) => {
    // ...
  }
);
```

**Points clés :**

1. On **type les props avec une `interface`** — c'est la convention standard.
2. On **déstructure** les props directement dans la signature : `({ x, y, size, ... })`.
3. Les **callbacks** (`onPress`) sont des props comme les autres — on passe une fonction à l'enfant, qui l'appelle quand il veut.
4. Les tableaux (`ships: Ship[]`) et objets sont des props comme les autres.

## Props optionnelles

```tsx
interface Props {
  title: string;
  subtitle?: string;  // ← le ? rend la prop optionnelle
}
```

## `React.FC` : pourquoi tu ne l'utilises PAS

Tu écris `export const AuthProvider = ({ children }: { children: ReactNode }) => ...` et **pas** `React.FC<Props>`. C'est une décision consciente :

- `React.FC` a eu des comportements bizarres historiquement (ajout implicite de `children`, mauvaise gestion des génériques).
- La convention moderne (React 18+) est la fonction avec typage explicite des props.

## Questions pour la soutenance

- Un composant peut-il modifier ses props ? Pourquoi ?
- Comment passer une fonction en prop ? Donne un exemple tiré de ton code.
- Quelle est la différence entre `onPress` passé en prop et `useEffect` ?
