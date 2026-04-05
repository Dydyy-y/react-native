# Space Conquest Online

Application mobile React Native / Expo pour le jeu de strategie multijoueur au tour par tour **Space Conquest Online**.

## Prerequis

- Node.js >= 18
- npm ou yarn
- Expo CLI (`npx expo`)
- Expo Go (sur appareil mobile) ou un emulateur Android/iOS

## Installation

```bash
npm install
```

## Demarrage

```bash
npx expo start
```

Scanner le QR code avec Expo Go (Android/iOS) ou appuyer sur `a` (Android) / `i` (iOS) pour lancer sur emulateur.

## Stack Technique

| Technologie | Role |
|---|---|
| React Native + Expo | Framework mobile |
| TypeScript (strict) | Typage statique |
| Context API + useReducer | Gestion d'etat (4 contexts independants) |
| Axios | Appels API avec interceptors |
| expo-secure-store | Stockage securise des tokens |
| React Navigation | Navigation (Stack + Tab) |
| expo-camera | Scanner QR code |

## Architecture

Architecture **Feature-Folder** :

```
src/
  features/
    auth/       → Authentification (login, signup, profil, token)
    lobby/      → Sessions de jeu (create, join, QR code, moderation)
    game/       → Jeu (carte, actions, fin de partie, historique)
    ui/         → Composants UI partages (toasts)
  shared/
    config/     → Client Axios avec interceptors
    hooks/      → usePolling (polling generique)
    utils/      → Constantes, validation, logger, errorHandler
    types/      → Types communs
  navigation/   → RootNavigator, AuthStack, AppTabs
```

## Fonctionnalites

### Authentification
- Inscription / Connexion
- Tokens securises (expo-secure-store)
- Deconnexion avec nettoyage du state
- Modification du profil (nom, email, mot de passe)

### Lobby
- Creation / Rejoindre une session
- QR code pour invitation
- Polling automatique (30s)
- Moderation : kick, ban, suppression (createur)
- Demarrage de partie

### Jeu
- Carte grille interactive (FlatList)
- Selection de vaisseaux + inspection
- Actions : deplacement, attaque, achat de vaisseaux
- Soumission d'actions par tour
- Polling etat de jeu (30s)
- Detection d'elimination
- Ecran de fin de partie (classement, stats, gagnant)

### Profil
- Affichage et modification du profil
- Historique des parties jouees avec details

## API

- **Base URL** : `https://space-conquest-online.osc-fr1.scalingo.io/api`
- **Documentation** : `https://space-conquest-online.osc-fr1.scalingo.io/api/documentation`
- **Rate limit** : 20 req/min
- **Polling** : 30s minimum

## Documentation

- [Decisions d'architecture](docs/DECISIONS.md)
- [Planning BMAD](_bmad/SPRINT_PLANNING.md)
