# Chapitre 5 — Conditional rendering & listes

[← Événements](04-evenements-formulaires.md) | [Index](README.md) | [Suivant : useEffect →](06-useeffect.md)

---

## Rendu conditionnel

Trois patterns, tu les utilises tous :

### 1. Opérateur `&&` (afficher si vrai)

[MapCell.tsx:44-48](../../src/features/game/components/MapCell.tsx#L44-L48) :

```tsx
{hasResource && (
  <View style={[styles.resource, ...]}>
    <Ionicons name="diamond" ... />
  </View>
)}
```

Si `hasResource` est `true`, React rend la `<View>`. Sinon, `false` est ignoré.

> ⚠️ **Piège classique** : `{items.length && <List/>}` → si `items.length === 0`, React affiche `0` à l'écran (React Native affiche le `0` texte). Utilise toujours un booléen strict : `{items.length > 0 && <List/>}`.

### 2. Ternaire (choisir entre deux)

[LoginScreen.tsx:109-113](../../src/features/auth/screens/LoginScreen.tsx#L109-L113) :

```tsx
{loading ? (
  <ActivityIndicator color={COLORS.white} />
) : (
  <Text style={styles.buttonText}>Se connecter</Text>
)}
```

### 3. `if` / early return

[RootNavigator.tsx:16-18](../../src/navigation/RootNavigator.tsx#L16-L18) :

```tsx
if (state.isLoading) return <SplashScreen />;
if (!state.user) return <AuthStack />;
return <AppTabs />;
```

## Listes et la prop `key`

Pour afficher un tableau de données, tu utilises `.map()` ou une `FlatList`. Chaque enfant d'une liste **DOIT** avoir une prop `key` unique et stable.

[GameMap.tsx:82-97](../../src/features/game/components/GameMap.tsx#L82-L97) :

```tsx
<FlatList
  data={cells}
  keyExtractor={(item) => item.key}          // ← key unique par cellule "x,y"
  numColumns={map.width}
  renderItem={({ item }) => (
    <MapCell x={item.x} y={item.y} ... />
  )}
  ...
/>
```

**Pourquoi `key` ?** React utilise `key` pour identifier quelle cellule existe déjà et quelle cellule est nouvelle. **Ne JAMAIS utiliser `index` comme key** si la liste peut être réordonnée ou filtrée — les composants se mélangent visuellement.

## Questions pour la soutenance

- Pourquoi `{items.length && <List/>}` est un piège en React Native ?
- Pourquoi la prop `key` est obligatoire ? Que se passe-t-il sans ?
- Pourquoi ne pas utiliser `index` comme key ?
