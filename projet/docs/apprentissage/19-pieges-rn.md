# Chapitre 19 — Pièges React Native classiques

[← TypeScript](18-typescript.md) | [Index](README.md) | [Plan de révision →](PLAN_REVISION.md)

---

## 1. `<View>{'0'}</View>` vs `<View>{0}</View>`

```tsx
{items.length && <List/>}
```

Si `items.length === 0` → le `0` est rendu comme texte → **crash en RN** ("Text strings must be rendered within a Text component"). Toujours `{items.length > 0 && <List/>}`.

## 2. FlatList et `keyExtractor`

**Ne jamais utiliser l'index** si la liste peut évoluer. `keyExtractor={(item) => String(item.id)}` est la norme.

## 3. `React.memo` ne marche pas avec des props non stables

```tsx
const Child = memo(ChildImpl);
<Child config={{ a: 1 }} />  // ❌ nouvelle ref à chaque render → memo inutile
```

Il faut que `config` soit stable (via `useMemo`), sinon `React.memo` compare deux refs différentes et re-rend quand même.

[GameMap.tsx:56](../../src/features/game/components/GameMap.tsx#L56) en est un bel exemple :

```tsx
const emptyShips: Ship[] = useMemo(() => [], []);
// ...
ships: shipsByPos.get(key) || emptyShips,
```

Sans `useMemo`, chaque cellule vide recevrait un **nouveau `[]`** → `React.memo` sur `MapCell` serait cassé.

## 4. Clavier qui masque les inputs

Toujours `<KeyboardAvoidingView>` + `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`.

## 5. `useEffect` qui fetche et set state sur un composant démonté

Si l'utilisateur quitte l'écran avant la fin du fetch, le setState crash (ou warn). Solutions :
- Flag `isMounted` dans le cleanup.
- `AbortController` + cancel sur cleanup.

Pas un énorme problème chez toi car tu stockes les données dans les Contexts (qui ne sont pas démontés), mais à connaître.

## 6. `Dimensions.get('window')` n'est pas réactif

[GameMap.tsx:42](../../src/features/game/components/GameMap.tsx#L42) :

```tsx
const screenWidth = Dimensions.get('window').width - 16;
```

Si l'utilisateur tourne l'écran, ce calcul **ne se met pas à jour**. Pour du responsive rotation, il faut `useWindowDimensions()` (hook RN). Ton app étant portrait-only, pas critique ici.

## Questions pour la soutenance

- Pourquoi `{x && <View/>}` est parfois un piège ?
- Pourquoi `useMemo(() => [], [])` sur un tableau vide ?
- Que faire si un fetch finit après que le composant soit démonté ?
