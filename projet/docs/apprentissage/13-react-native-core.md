# Chapitre 13 — React Native core

[← Async patterns](12-async-patterns.md) | [Index](README.md) | [Suivant : Navigation →](14-navigation.md)

---

## Différence avec React web

Même mental model (JSX, state, hooks), mais les **primitives** sont différentes :

| Web | React Native | Rôle |
|-----|--------------|------|
| `<div>` | `<View>` | container layout |
| `<span>` / `<p>` | `<Text>` | texte |
| `<input>` | `<TextInput>` | saisie |
| `<button>` | `<TouchableOpacity>` / `<Pressable>` | bouton |
| `<img>` | `<Image>` | image |
| `<ul><li>` massif | `<FlatList>` | liste perf |

**Règle stricte** : en RN, **le texte doit être dans un `<Text>`**. `<View>Hello</View>` crash.

## `StyleSheet`

Pas de CSS. Les styles sont des **objets JS** (camelCase au lieu de kebab-case).

```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
});

<View style={styles.container} />
```

**Pourquoi `StyleSheet.create` plutôt qu'un objet littéral ?** Validation des clés (erreur si tu tapes `backgrondColor`) et légère optimisation (les styles deviennent des IDs internes).

## Styles combinés

[LoginScreen.tsx:72](../../src/features/auth/screens/LoginScreen.tsx#L72) :

```tsx
<TextInput style={[styles.input, errors.email ? styles.inputError : null]} />
```

Un tableau combine les styles. Le dernier écrase le premier (comme une cascade). `null`/`false` sont ignorés.

## Flexbox partout

Contrairement au web, **tout est flexbox par défaut** en RN, avec `flexDirection: 'column'` par défaut. Il n'y a pas de `display: block`, pas de flottants. Si tu connais flexbox web, tu connais 90% du layout RN.

## `FlatList` vs `ScrollView`

- **`ScrollView`** : rend **tous** les enfants d'un coup. Bon pour ~10-20 items, catastrophique pour 1000.
- **`FlatList`** : **virtualisée** — ne rend que les items visibles à l'écran. Obligatoire pour les grandes listes.

[GameMap.tsx:82](../../src/features/game/components/GameMap.tsx#L82) utilise `FlatList` pour la grille (jusqu'à 20×20 = 400 cellules).

## `KeyboardAvoidingView`

Sur mobile, le clavier masque les inputs. [LoginScreen.tsx:56-59](../../src/features/auth/screens/LoginScreen.tsx#L56-L59) :

```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
```

iOS et Android gèrent le clavier différemment → `Platform.OS` pour choisir le bon `behavior`.

## Questions pour la soutenance

- Pourquoi on ne peut pas faire `<View>Hello</View>` ?
- Quelle est la différence entre `FlatList` et `ScrollView` ?
- Comment gère-t-on les différences iOS / Android ?
