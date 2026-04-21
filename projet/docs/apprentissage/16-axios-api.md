# Chapitre 16 — Couche API (Axios)

[← Feature-folder](15-feature-folder.md) | [Index](README.md) | [Suivant : Sécurité →](17-securite.md)

---

## Problème : on ne veut pas répéter le token partout

Chaque requête a besoin de `Authorization: Bearer xxx`. L'écrire à la main dans chaque service = maintenance impossible.

## Solution : instance Axios avec interceptors

[apiClient.ts](../../src/shared/config/apiClient.ts) crée **une seule** instance Axios partagée, avec 2 interceptors :

- **Request interceptor** : ajoute automatiquement le header `Authorization`.
- **Response interceptor** : déconnecte l'utilisateur sur 401.

## Subtilité : l'injection de callbacks

```tsx
let _getToken: TokenGetter | null = null;
let _onUnauthorized: UnauthorizedHandler | null = null;

export const configureApiClient = (
  getToken: TokenGetter,
  onUnauthorized: UnauthorizedHandler,
): void => {
  _getToken = getToken;
  _onUnauthorized = onUnauthorized;
};
```

**Pourquoi ?** Si `apiClient.ts` importait `AuthContext`, et que `AuthContext` importait des services (qui importent `apiClient`), on aurait une **dépendance circulaire**.

Le pattern inverse ça : `apiClient` ne connaît personne, il expose une fonction `configureApiClient(...)`. C'est `AuthProvider` qui s'enregistre au montage :

[AuthContext.tsx:90-92](../../src/features/auth/contexts/AuthContext.tsx#L90-L92) :

```tsx
useEffect(() => {
  configureApiClient(getToken, () => logoutRef.current());
}, []);
```

**C'est de l'inversion de dépendance (Dependency Inversion Principle)** — le module bas niveau (apiClient) ne dépend pas du module haut niveau (auth), c'est l'inverse.

## Le flag `_isLoggingOut`

[apiClient.ts:45-58](../../src/shared/config/apiClient.ts#L45-L58) : si plusieurs requêtes échouent simultanément en 401, on ne veut pas appeler `logout()` plusieurs fois en parallèle. Le flag global évite le multi-déclenchement.

## Questions pour la soutenance

- Pourquoi un seul `apiClient` partagé plutôt qu'un par service ?
- Qu'est-ce qu'un interceptor ?
- Pourquoi le pattern "injection de callbacks" plutôt qu'importer directement le context ?
