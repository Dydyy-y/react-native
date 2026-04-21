# Chapitre 17 — Sécurité

[← Axios/API](16-axios-api.md) | [Index](README.md) | [Suivant : TypeScript →](18-typescript.md)

---

## Le token JWT

Un JWT est un token d'authentification **sensible**. S'il fuit, quelqu'un peut se faire passer pour l'utilisateur jusqu'à son expiration.

## Règle : `expo-secure-store`, jamais AsyncStorage ni localStorage

[tokenStorage.ts](../../src/features/auth/services/tokenStorage.ts) :

- **iOS** : stocké dans le **Keychain** (chiffré par le hardware).
- **Android** : stocké dans **EncryptedSharedPreferences** (KeyStore).
- **Web** (dev only) : fallback `localStorage` — **PAS ACCEPTABLE en prod**.

## Headers d'autorisation

Le token est injecté dans chaque requête par l'interceptor (voir [chapitre 16](16-axios-api.md)). **Jamais de token hardcodé dans le code**, jamais de token dans les URLs, jamais de token en paramètre GET (ça se retrouve dans les logs).

## Déconnexion automatique sur 401

[apiClient.ts:46-58](../../src/shared/config/apiClient.ts#L46-L58) : si l'API renvoie 401 (token invalide/expiré), on **déconnecte et redirige vers Login**. L'utilisateur ne reste pas bloqué avec un token mort.

**Exception** : les routes `/auth/login` et `/auth/register` **DOIVENT** pouvoir renvoyer 401 (mot de passe faux) sans déclencher un logout. D'où la condition `!isAuthRoute`.

## Questions pour la soutenance

- Pourquoi `expo-secure-store` et pas `AsyncStorage` ?
- Qu'est-ce qu'un JWT ? Que contient-il ?
- Pourquoi le logout auto sur 401 ne concerne-t-il pas `/auth/login` ?
