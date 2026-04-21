# Chapitre 7 — Context API

[← useEffect](06-useeffect.md) | [Index](README.md) | [Suivant : useReducer →](08-usereducer.md)

---

## Problème que ça résout

Imagine que ton `user` soit dans `App.tsx` et qu'il faille l'afficher dans `ProfileScreen`. Sans Context, il faut passer `user` en prop à **tous les composants intermédiaires** : `App → RootNavigator → AppTabs → ProfileStack → ProfileScreen`. C'est le **"prop drilling"**.

Le Context permet de **mettre une valeur à disposition** d'une sous-arborescence sans la passer explicitement.

## Les 3 ingrédients

1. **`createContext`** — crée un "canal" typé.
2. **`<Context.Provider value={...}>`** — injecte une valeur dans ce canal.
3. **`useContext(Context)`** — lit la valeur depuis n'importe quel descendant du Provider.

## Dans ton code

[GameContext.tsx](../../src/features/game/contexts/GameContext.tsx) — le plus clair de tes contextes :

```tsx
// 1. Création du context
const GameContext = createContext<GameContextValue | null>(null);

// 2. Provider qui fournit la valeur
export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// 3. Hook d'accès (convention : useXxx)
export const useGameContext = (): GameContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
};
```

## Le pattern "null + throw"

```tsx
createContext<GameContextValue | null>(null);
```

La valeur par défaut est `null`. Si quelqu'un utilise `useGameContext()` **hors** d'un `<GameProvider>`, on throw une erreur explicite. Sans ça, tu aurais un `TypeError: Cannot read property 'state' of null` bien plus cryptique.

## L'empilement des Providers dans ton App

[App.tsx:13-27](../../App.tsx#L13-L27) :

```tsx
<UIProvider>
  <AuthProvider>
    <LobbyProvider>
      <GameProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GameProvider>
    </LobbyProvider>
  </AuthProvider>
</UIProvider>
```

**L'ordre compte** : un Provider peut lire un Provider qui est **au-dessus** de lui dans l'arbre, pas en dessous. Si `GameProvider` avait besoin de `useAuth()`, il doit être **à l'intérieur** de `AuthProvider`. C'est le cas ici.

## Piège important : tout `useContext` re-render tous ses consumers

Si le `value` du Provider change, **TOUS** les composants qui font `useContext` sur ce Context re-rendent. C'est pour ça que tu fais :

```tsx
const value = useMemo(() => ({ state, dispatch }), [state]);
```

Ça évite de recréer un nouvel objet `{ state, dispatch }` à chaque render du Provider — ce qui causerait des re-renders inutiles chez les consumers. **C'est de l'optimisation, pas cosmétique.**

## Questions pour la soutenance

- Qu'est-ce que le "prop drilling" ?
- Pourquoi tu crées un hook `useGameContext` plutôt que d'appeler `useContext(GameContext)` directement dans chaque écran ?
- Pourquoi le `useMemo` dans `GameProvider` ? Que se passe-t-il sans ?
