# Chapitre 15 — Architecture feature-folder

[← Navigation](14-navigation.md) | [Index](README.md) | [Suivant : Axios/API →](16-axios-api.md)

---

## Organisation

```
src/features/auth/
├── contexts/     → AuthContext
├── hooks/        → useLogin, useRegister
├── screens/      → LoginScreen, SignUpScreen, ProfileScreen, SplashScreen
├── services/     → authService, tokenStorage
├── types/        → auth.types.ts
├── styles/       → authStyles.ts
└── index.ts      → surface publique
```

## Les 3 principes

1. **Un dossier par fonctionnalité métier** (auth, lobby, game, ui).
2. **Interface publique explicite** via `index.ts`.
3. **Pas d'imports croisés** entre features. Si auth et lobby ont besoin de quelque chose en commun → ça va dans `shared/`.

## Exemple : dépendance inter-features

Le Lobby n'importe jamais directement AuthContext. Si l'API a besoin du token → ça passe par l'**interceptor Axios** configuré par Auth (voir [chapitre 16](16-axios-api.md)). Les features restent **découplées**.

## Pourquoi pas une organisation par **type** (`/components`, `/hooks`, `/screens`) ?

C'est l'organisation "traditionnelle" mais elle ne **passe pas à l'échelle** :
- À 50 écrans, tu ne trouves plus rien.
- Tu ne sais pas quelle feature "possède" un fichier.
- Supprimer une feature devient un cauchemar (dispersion).

Avec feature-folders, **supprimer l'auth = `rm -rf src/features/auth`**.

## Questions pour la soutenance

- Pourquoi `features/` et pas `components/` + `hooks/` + `screens/` ?
- Comment empêches-tu les dépendances croisées entre features ?
- Pourquoi le `shared/` existe ?
