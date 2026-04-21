# Chapitre 14 — Navigation

[← React Native core](13-react-native-core.md) | [Index](README.md) | [Suivant : Feature-folder →](15-feature-folder.md)

---

## Les 3 navigators clés

- **Stack Navigator** — pile d'écrans (push/pop). Animation de slide par défaut.
- **Tab Navigator** — onglets en bas. C'est le `TabsNavigator` obligatoire selon la consigne.
- **Drawer Navigator** — tiroir latéral (pas utilisé ici).

## Imbrication dans ton projet

[AppTabs.tsx](../../src/navigation/AppTabs.tsx) :

```
Tab (Lobby | Game | Profile)
├── Lobby  → LobbyStack (LobbyHome, CreateSession, JoinSession, SessionDetail)
├── Game   → GameStack (GameMain, GameOver)
└── Profile → ProfileStack (ProfileMain, GameHistory)
```

Tu **imbriques** un Stack dans chaque Tab. C'est le pattern standard : un onglet peut empiler plusieurs écrans (ex. LobbyHome → CreateSession → SessionDetail).

## Typage des routes

[NavigationTypes.ts](../../src/navigation/NavigationTypes.ts) déclare les types :

```tsx
type LobbyStackParamList = {
  LobbyHome: undefined;
  CreateSession: undefined;
  JoinSession: undefined;
  SessionDetail: { sessionId: number };  // ← cet écran attend un sessionId
};
```

Dans l'écran :

```tsx
type Props = StackScreenProps<LobbyStackParamList, 'SessionDetail'>;
export const SessionDetailScreen = ({ navigation, route }: Props) => {
  const { sessionId } = route.params;  // ← TS sait que c'est un number
};
```

**TypeScript vérifie** qu'on passe bien `sessionId` lors de la navigation :

```tsx
navigation.navigate('SessionDetail', { sessionId: 42 });  // ✅
navigation.navigate('SessionDetail');                     // ❌ TS error
```

## Navigation protégée par authentification

[RootNavigator.tsx](../../src/navigation/RootNavigator.tsx) :

```tsx
if (state.isLoading) return <SplashScreen />;
if (!state.user) return <AuthStack />;
return <AppTabs />;
```

**Pattern élégant** : on **swap entièrement** le navigator selon l'état d'auth. Quand l'user se déconnecte, `state.user` devient null → on repasse à `AuthStack`. Pas besoin de `navigation.reset()`.

## Questions pour la soutenance

- Pourquoi imbriquer un Stack dans un Tab ?
- Comment TypeScript aide à éviter les erreurs de navigation ?
- Pourquoi tu ne fais pas de `navigation.reset()` au logout ?
