# Explication complète du code — Épic 1 : Authentification

> Ce fichier explique **chaque décision et chaque ligne** du code généré.
> Objectif : que tu puisses expliquer n'importe quelle partie à l'oral ou par écrit.

---

## Table des matières

1. [Vision globale : comment tout s'assemble](#1-vision-globale)
2. [Le flux complet d'une inscription](#2-le-flux-complet-dune-inscription)
3. [shared/utils/constants.ts](#3-sharedutilsconstantsts)
4. [shared/utils/validation.ts](#4-sharedutilsvalidationts)
5. [shared/utils/errorHandler.ts](#5-sharedutilserrorhandlerts)
6. [shared/utils/logger.ts](#6-sharedutilsloggerts)
7. [shared/config/apiClient.ts](#7-sharedconfigapiclientts)
8. [features/auth/types/auth.types.ts](#8-featuresauthtypesauthtypests)
9. [features/auth/services/tokenStorage.ts](#9-featuresauthservicestokenstoragets)
10. [features/auth/services/authService.ts](#10-featuresauthservicesauthservicets)
11. [features/auth/contexts/AuthContext.tsx](#11-featuresauthcontextsauthcontexttsx)
12. [features/auth/hooks/useRegister.ts](#12-featuresauthhooksuseregisterts)
13. [features/auth/hooks/useLogin.ts](#13-featuresauthhooksuselogints)
14. [features/ui/contexts/UIContext.tsx](#14-featuresuicontextsuicontexttsx)
15. [features/ui/components/Toast.tsx](#15-featuresuicomponentstoasttsx)
16. [features/auth/screens/SplashScreen.tsx](#16-featuresauthscreenssplashscreentsx)
17. [features/auth/screens/SignUpScreen.tsx](#17-featuresauthscreenssignupscreentsx)
18. [features/auth/screens/LoginScreen.tsx](#18-featuresauthscreensloginscreentsx)
19. [features/auth/screens/ProfileScreen.tsx](#19-featuresauthscreensprofilescreentsx)
20. [navigation/NavigationTypes.ts](#20-navigationnavigationtypests)
21. [navigation/AuthStack.tsx](#21-navigationauthstacktsx)
22. [navigation/AppTabs.tsx](#22-navigationapptabstsx)
23. [navigation/RootNavigator.tsx](#23-navigationrootnavigatortsx)
24. [App.tsx](#24-apptsx)
25. [Les patterns réutilisés partout](#25-les-patterns-réutilisés-partout)

---

## 1. Vision globale

### Ce que fait l'application au démarrage

```
L'utilisateur ouvre l'app
        ↓
App.tsx charge les Providers (UIProvider, AuthProvider)
        ↓
AuthProvider vérifie : est-ce qu'il y a un token sauvegardé ?
        ↓
    OUI → valide le token avec l'API (/auth/me)
              → valide : charge l'utilisateur → AppTabs (Lobby)
              → invalide : supprime le token → LoginScreen
    NON → LoginScreen directement
```

### Les 4 couches du code

```
┌─────────────────────────────────────────┐
│  ÉCRANS (Screens)                       │  ← Ce que l'utilisateur voit
│  SignUpScreen, LoginScreen, etc.        │
├─────────────────────────────────────────┤
│  HOOKS                                  │  ← La logique de chaque action
│  useRegister, useLogin                  │
├─────────────────────────────────────────┤
│  SERVICES                               │  ← Les appels API (HTTP)
│  authService, tokenStorage              │
├─────────────────────────────────────────┤
│  CONTEXTES (State global)               │  ← La mémoire de l'app
│  AuthContext, UIContext                 │
└─────────────────────────────────────────┘
```

### Pourquoi ces 4 couches ?

**Le problème** : si on met tout dans l'écran (l'appel API, la gestion d'erreur, le stockage du token...), on obtient un composant de 500 lignes impossible à maintenir.

**La solution** : chaque couche a une responsabilité unique.
- L'**écran** : afficher et collecter les données utilisateur
- Le **hook** : coordonner l'action (appeler le service, mettre à jour le contexte)
- Le **service** : faire l'appel HTTP (et uniquement ça)
- Le **contexte** : stocker l'état global (qui est connecté ?)

### Pourquoi Context API + useReducer ?

C'est une contrainte du projet, mais voici pourquoi c'est un bon choix :

**Context API** = un "store" global accessible dans n'importe quel composant sans passer des props à la main.

**useReducer** = au lieu de modifier l'état directement, on envoie des "actions" décrites par des objets. C'est le même principe que Redux, mais sans bibliothèque externe.

```
Composant → dispatch({ type: 'SET_USER', payload: user })
                    ↓
              authReducer reçoit l'action
                    ↓
              Calcule le nouvel état
                    ↓
              Tous les composants qui lisent ce contexte se re-rendent
```

---

## 2. Le flux complet d'une inscription

Pour tout comprendre, voici ce qui se passe quand l'utilisateur appuie sur "S'inscrire" :

```
1. SignUpScreen.handleSubmit()
   → Valide le formulaire côté client
   → Appelle useRegister.execute({ username, email, password })

2. useRegister.execute()
   → Appelle authService.register(username, email, password)

3. authService.register()
   → Fait POST /auth/register via apiClient
   → apiClient ajoute automatiquement Content-Type: application/json
   → Reçoit { user, access_token, ... }

4. useRegister.execute() (suite)
   → Appelle tokenStorage.saveToken(access_token)
     → expo-secure-store chiffre et stocke le token dans le keychain
   → dispatch({ type: 'SET_TOKEN', payload: token })
   → dispatch({ type: 'SET_USER', payload: user })

5. AuthContext se met à jour
   → state.user est maintenant défini

6. RootNavigator se re-rend
   → state.user !== null → affiche <AppTabs /> au lieu de <AuthStack />

7. L'utilisateur est maintenant connecté et voit l'écran Lobby
```

---

## 3. shared/utils/constants.ts

```typescript
export const API_BASE_URL = 'https://space-conquest-online.osc-fr1.scalingo.io/api';
```
- `export` = ce fichier exporte cette valeur pour qu'elle soit importée ailleurs
- `const` = valeur non modifiable (une URL ne change pas)
- C'est l'URL de base de l'API. En la centralisant ici, si l'URL change, on ne modifie qu'un seul endroit.

```typescript
export const TOKEN_KEY = 'auth_token';
```
- La clé utilisée pour stocker le token dans expo-secure-store.
- C'est une chaîne quelconque — c'est juste le "nom du tiroir" dans le trousseau de clés.

```typescript
export const POLLING_INTERVAL_MS = 30000;
```
- 30 000 millisecondes = 30 secondes. C'est l'intervalle minimum entre deux appels API répétés (rate limit du serveur : 20 req/min).
- Sera utilisé dans les hooks de polling (Epic 2+).

```typescript
export const COLORS = {
  success: '#4CAF50',   // Vert → succès
  error: '#f44336',     // Rouge → erreur
  info: '#2196F3',      // Bleu → info
  background: '#0a0a1a', // Noir presque pur → fond de l'app (thème spatial)
  surface: '#1a1a2e',   // Gris très foncé → fond des cards, inputs
  text: '#e0e0e0',      // Gris clair → texte principal
  textSecondary: '#9e9e9e', // Gris moyen → texte secondaire, placeholders
  border: '#2a2a4a',    // Bleu très foncé → bordures des inputs
  white: '#ffffff',
  // ... autres
};
```
- En centralisant toutes les couleurs ici, on évite d'avoir des codes hex `#f44336` éparpillés dans 20 fichiers.
- Si on veut changer le thème, on ne modifie que ce fichier.

---

## 4. shared/utils/validation.ts

```typescript
export const isValidUsername = (username: string): boolean =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username);
```
- Paramètre `username: string` → TypeScript force qu'on passe bien une chaîne
- Retourne `boolean` → `true` si valide, `false` sinon
- **L'expression régulière** `/^[a-zA-Z0-9_]{3,20}$/` :
  - `^` = début de la chaîne
  - `[a-zA-Z0-9_]` = uniquement des lettres (majuscules/minuscules), chiffres, ou `_`
  - `{3,20}` = entre 3 et 20 caractères
  - `$` = fin de la chaîne
  - `.test(username)` = applique le regex sur la chaîne, retourne true/false

```typescript
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```
- `[^\s@]+` = un ou plusieurs caractères qui ne sont ni un espace (`\s`) ni un `@`
- Le `@` est obligatoire (littéral)
- Puis un `.` littéral (`\.`), puis encore des caractères
- Exemple valide : `test@example.com`

```typescript
export const isValidPassword = (password: string): boolean =>
  password.length >= 8;
```
- Plus simple : juste vérifier que la longueur est >= 8.

---

## 5. shared/utils/errorHandler.ts

```typescript
import { AxiosError } from 'axios';
```
- On importe le type `AxiosError` d'Axios. C'est un type TypeScript qui décrit les erreurs spécifiques à Axios.

```typescript
export const getErrorMessage = (error: unknown): string => {
```
- `error: unknown` = TypeScript ne sait pas quel type d'erreur va arriver (une erreur JavaScript peut être n'importe quoi).
- `: string` = cette fonction retourne toujours une chaîne de caractères.

```typescript
  if (error instanceof AxiosError) {
    const data = error.response?.data;
```
- `instanceof` = vérifie si l'erreur est bien une erreur Axios
- `error.response?.data` = le `?` est l'opérateur "optional chaining" : si `response` est `null` ou `undefined`, ne plante pas, retourne `undefined`.

```typescript
    if (typeof data?.message === 'string') return data.message;
    if (Array.isArray(data?.message)) return data.message.join(', ');
```
- Certaines APIs retournent `message: "erreur"` (string)
- D'autres retournent `message: ["champ requis", "email invalide"]` (tableau)
- On gère les deux cas.

```typescript
    return error.message || 'Une erreur serveur est survenue';
```
- Si aucun message API, on utilise le message générique d'Axios (ex: "Network Error").

```typescript
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inconnue est survenue';
```
- Filet de sécurité pour les autres types d'erreurs JavaScript.

---

## 6. shared/utils/logger.ts

```typescript
export const logger = {
  log: (...args: unknown[]) => __DEV__ && console.log('[LOG]', ...args),
```
- `__DEV__` est une variable globale définie par React Native/Expo.
  - `true` quand l'app tourne en développement (sur ton téléphone via Expo Go)
  - `false` en production (quand l'app est publiée sur l'App Store)
- `&&` = court-circuit : si `__DEV__` est false, `console.log` n'est **jamais appelé**. Cela évite d'afficher des logs sensibles en production.
- `...args: unknown[]` = l'opérateur spread — accepte un nombre variable d'arguments.

---

## 7. shared/config/apiClient.ts

C'est le **cœur de la communication avec l'API**. À lire attentivement.

```typescript
import axios, { InternalAxiosRequestConfig } from 'axios';
```
- `axios` = la bibliothèque HTTP (comme `fetch` mais en plus puissant)
- `InternalAxiosRequestConfig` = le type TypeScript d'une config de requête Axios (pour les interceptors)

### Le problème des dépendances circulaires

```typescript
type TokenGetter = () => Promise<string | null>;
type UnauthorizedHandler = () => void;

let _getToken: TokenGetter | null = null;
let _onUnauthorized: UnauthorizedHandler | null = null;
```

**Pourquoi ne pas importer directement `tokenStorage` ici ?**

Si `apiClient.ts` (dans `shared/`) importait `tokenStorage.ts` (dans `features/auth/`), cela créerait une violation de l'architecture : `shared/` ne doit pas dépendre de `features/`.

**La solution** : injection de dépendances via des variables module.
- `_getToken` : une fonction qui retourne le token (sera fournie par `AuthProvider`)
- `_onUnauthorized` : une fonction à appeler si le serveur retourne 401 (sera le `logout` de `AuthProvider`)

```typescript
export const configureApiClient = (
  getToken: TokenGetter,
  onUnauthorized: UnauthorizedHandler,
): void => {
  _getToken = getToken;
  _onUnauthorized = onUnauthorized;
};
```
- `AuthProvider` appellera cette fonction au démarrage : `configureApiClient(getToken, logout)`
- Résultat : `apiClient` sait comment lire le token et comment déclencher le logout, sans importer directement ces modules.

### Création de l'instance Axios

```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,  // Toutes les requêtes partent de cette URL de base
  timeout: 10000,         // 10 secondes maximum — après, l'erreur "timeout" est levée
  headers: { 'Content-Type': 'application/json' }, // Toutes nos requêtes envoient du JSON
});
```

`axios.create()` crée une instance configurée. Toutes les requêtes faites via `apiClient.post('/auth/login', ...)` utiliseront automatiquement ces paramètres.

### Interceptor de requête (ajout du token)

```typescript
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (_getToken) {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);
```

**Qu'est-ce qu'un interceptor ?** C'est un "middleware" — une fonction qui s'exécute automatiquement avant chaque requête (ou après chaque réponse).

- Avant chaque requête, on lit le token depuis le SecureStore (`await _getToken()`)
- Si un token existe, on ajoute `Authorization: Bearer eyJhbGc...` dans les headers
- `return config` = on laisse la requête partir avec la config modifiée
- Le second argument `(error) => Promise.reject(error)` = si la config elle-même plante, on propage l'erreur

**Pourquoi `async` ?** Lire depuis `expo-secure-store` est une opération asynchrone (accès au keychain natif iOS/Android). On doit `await` ce résultat.

### Interceptor de réponse (gestion du 401)

```typescript
apiClient.interceptors.response.use(
  (response) => response,  // Succès : on laisse passer la réponse sans modification
  (error) => {
    if (error.response?.status === 401 && _onUnauthorized) {
      _onUnauthorized(); // Token expiré → déconnecter l'utilisateur
    }
    return Promise.reject(error); // Propager l'erreur pour que le hook puisse la gérer
  },
);
```

- HTTP 401 = "Non autorisé" → le token est invalide ou expiré
- On appelle `_onUnauthorized()` qui est le `logout` de `AuthContext` (supprime le token + vide le state)
- On propage quand même l'erreur (`Promise.reject`) pour que le hook (`useLogin`, `useRegister`) puisse afficher un message

---

## 8. features/auth/types/auth.types.ts

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
}
```
- `interface` en TypeScript = description de la forme d'un objet
- `User` correspond exactement à ce que l'API retourne dans `response.user`

```typescript
export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;   // Toujours "Bearer" pour ce type d'API
  expires_in: number;   // Durée de validité en secondes
}
```
- `AuthResponse` = la réponse complète de `/auth/login` et `/auth/register`
- En typant la réponse, TypeScript nous prévient si on essaie d'accéder à `response.token` (inexistant) au lieu de `response.access_token`.

---

## 9. features/auth/services/tokenStorage.ts

```typescript
import * as SecureStore from 'expo-secure-store';
```
- `import * as SecureStore` = importe tous les exports du module sous le nom `SecureStore`
- `expo-secure-store` = module Expo qui utilise le **Keychain** sur iOS et le **Keystore** sur Android — des zones mémoire chiffrées par le hardware du téléphone.

```typescript
export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};
```
- `async/await` : les opérations de stockage sont asynchrones (elles communiquent avec le système d'exploitation)
- `Promise<void>` : retourne une promesse qui ne contient rien (juste signale "c'est fait")
- `setItemAsync(clé, valeur)` : stocke la valeur sous cette clé dans le SecureStore

```typescript
export const getToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(TOKEN_KEY);
};
```
- `Promise<string | null>` : retourne soit le token (string) soit `null` si rien n'est stocké
- `getItemAsync` retourne `null` si la clé n'existe pas — pas d'erreur levée

```typescript
export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
```
- Appelé lors du logout ou quand un token invalide est détecté

---

## 10. features/auth/services/authService.ts

```typescript
import apiClient from '../../../shared/config/apiClient';
```
- `../../../` = remonte 3 niveaux (`hooks` → `auth` → `features` → `src`) puis descend vers `shared/config/apiClient`
- On importe l'instance Axios configurée (avec les interceptors)

```typescript
export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
};
```
- `apiClient.post<AuthResponse>(...)` : le `<AuthResponse>` est un **générique TypeScript** — il dit à TypeScript "la réponse de cette requête sera de type AuthResponse". Cela permet l'autocomplétion et la vérification de type.
- `'/auth/register'` : chemin relatif à la `baseURL`. La requête réelle ira vers `https://.../api/auth/register`
- `{ username, email, password }` : shorthand ES6 — équivalent à `{ username: username, email: email, password: password }`
- `response.data` : Axios encapsule la réponse dans `{ data, status, headers, ... }`. On extrait juste `data`.

```typescript
export const validateToken = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};
```
- Pas de paramètres : l'interceptor de requête ajoutera automatiquement le token Bearer
- Retourne le `User` courant si le token est valide, sinon lève une erreur 401

---

## 11. features/auth/contexts/AuthContext.tsx

C'est le fichier le plus important de l'Épic 1. Il gère **l'état global de l'authentification**.

### Le State et les Actions

```typescript
interface AuthState {
  user: User | null;    // null = pas connecté
  token: string | null; // null = pas de token
  isLoading: boolean;   // true pendant la vérification du token au démarrage
  error: string | null; // message d'erreur ou null
}
```

```typescript
type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }       // Pas de payload — juste l'action
  | { type: 'CLEAR_ERROR' };
```
- `type AuthAction = A | B | C` = union de types. Une action est **soit** `SET_USER`, **soit** `SET_TOKEN`, etc.
- TypeScript vérifiera que quand on dispatch `SET_USER`, on fournit bien un `payload: User | null`.

### Le Reducer

```typescript
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
```
- `(state, action) => newState` : une **fonction pure** — même entrées = même sorties, pas d'effets de bord
- `{ ...state, user: action.payload }` : **spread operator** — copie tout l'état existant, puis écrase uniquement `user`
- **Immutabilité** : on ne modifie jamais `state` directement. On retourne un **nouvel objet**. C'est ce qui permet à React de détecter les changements.

```typescript
    case 'LOGOUT':
      return { ...state, user: null, token: null, error: null };
```
- Un seul `dispatch({ type: 'LOGOUT' })` remet `user` et `token` à `null` en une seule opération atomique.

### Le Provider et ses effets

```typescript
const logout = useCallback(async () => {
  await removeToken();
  dispatch({ type: 'LOGOUT' });
}, []);
```
- `useCallback` : mémoïse la fonction `logout`. Sans ça, `logout` serait recréée à chaque re-render du composant.
- `[]` en dépendances = la fonction ne change jamais après le premier render.
- `removeToken()` puis `dispatch('LOGOUT')` : d'abord supprimer du stockage, puis vider le state.

```typescript
const logoutRef = useRef(logout);
logoutRef.current = logout;
```
- `useRef` crée une référence mutable qui persiste entre les re-renders sans déclencher de re-render.
- On met toujours à jour `logoutRef.current = logout` pour avoir la dernière version de la fonction.

```typescript
useEffect(() => {
  configureApiClient(getToken, () => logoutRef.current());
}, []);
```
- `useEffect(fn, [])` = s'exécute **une seule fois** au montage du composant.
- On configure `apiClient` avec :
  - `getToken` : la fonction pour lire le token (depuis tokenStorage)
  - `() => logoutRef.current()` : une lambda qui appelle toujours la version courante de `logout` via la ref

**Pourquoi la ref ?** Si on passait `logout` directement dans le `useEffect`, la closure capturerait la version initiale de `logout`. Grâce à la ref, on appelle toujours la version la plus récente.

```typescript
useEffect(() => {
  const checkStoredToken = async () => {
    try {
      const token = await getToken();
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return; // Pas de token → arrêter ici
      }
      const user = await validateToken(); // Vérifier que le token est encore valide
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      await removeToken(); // Token invalide → nettoyage
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false }); // Toujours désactiver le loading
    }
  };
  checkStoredToken();
}, []);
```
- `finally` s'exécute **toujours**, que le `try` ait réussi ou que le `catch` ait été déclenché.
- C'est crucial : `isLoading` doit passer à `false` dans tous les cas, sinon l'app reste bloquée sur le SplashScreen.

### La syntaxe du Context

```typescript
const AuthContext = createContext<AuthContextType>(null!);
```
- `createContext<AuthContextType>(null!)` : crée un contexte typé.
- `null!` : le `!` est une assertion TypeScript — on dit "je sais que c'est null maintenant, mais ce sera toujours utilisé à l'intérieur d'un Provider". Sans `!`, TypeScript se plaindrait car `null` n'est pas de type `AuthContextType`.

```typescript
export const useAuth = () => useContext(AuthContext);
```
- Hook custom qui encapsule `useContext(AuthContext)`.
- Tous les composants font `const { state, dispatch } = useAuth()` au lieu de `useContext(AuthContext)`.

---

## 12. features/auth/hooks/useRegister.ts

```typescript
export const useRegister = (): UseRegisterReturn => {
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(false);
```
- `useAuth()` : accès au dispatch du contexte
- `useState(false)` : état local de loading — `false` par défaut

```typescript
  const execute = async ({ username, email, password }: RegisterParams): Promise<ExecuteResult> => {
    setLoading(true);
    try {
      const response = await register(username, email, password);
      await saveToken(response.access_token);
      dispatch({ type: 'SET_TOKEN', payload: response.access_token });
      dispatch({ type: 'SET_USER', payload: response.user });
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };
```
- `{ username, email, password }: RegisterParams` = destructuring du paramètre objet avec typage
- En cas de succès : le dispatch de `SET_USER` mettra à jour le contexte → `RootNavigator` re-rendra avec `AppTabs`
- En cas d'erreur : on retourne `{ success: false, error: "..." }` — l'écran affichera un toast
- `finally` : `loading` repasse à `false` dans tous les cas

**Le pattern `ExecuteResult`** est plus propre que d'avoir un state `error` dans le hook, parce que l'erreur est un événement ponctuel (on ne veut pas qu'elle persiste dans le hook).

---

## 13. features/auth/hooks/useLogin.ts

Identique à `useRegister` mais appelle `authService.login()` au lieu de `authService.register()`. Même pattern, même logique.

---

## 14. features/ui/contexts/UIContext.tsx

Gère l'affichage des **notifications toast** (les petites bandeaux qui apparaissent en haut).

```typescript
export type ToastType = 'success' | 'error' | 'info';
```
- `type` (alias de type) définit les 3 valeurs possibles pour le type d'un toast.
- TypeScript refusera `showToast("message", "warning")` car `"warning"` n'est pas dans l'union.

```typescript
export interface Toast {
  id: string;       // Identifiant unique pour pouvoir supprimer le bon toast
  message: string;
  type: ToastType;
}
```

```typescript
const showToast = useCallback((message: string, type: ToastType) => {
  const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
```
- `Date.now()` = timestamp en millisecondes (unique dans le temps)
- `Math.random().toString(36).slice(2)` = chaîne aléatoire en base 36 (chiffres + lettres)
- On combine les deux pour un identifiant très probablement unique

```typescript
  dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
  setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
}, []);
```
- On ajoute le toast immédiatement
- `setTimeout` planifie sa suppression dans 4 secondes
- Le toast peut aussi être supprimé manuellement (en appuyant dessus)

---

## 15. features/ui/components/Toast.tsx

```typescript
const TOAST_BG: Record<ToastType, string> = {
  success: COLORS.success,
  error: COLORS.error,
  info: COLORS.info,
};
```
- `Record<ToastType, string>` = un objet TypeScript dont les clés sont des `ToastType` et les valeurs des `string`.
- Si on oublie d'ajouter `warning` à `TOAST_BG` mais qu'on l'ajoute à `ToastType`, TypeScript signalera l'erreur.

```typescript
export const ToastContainer = () => {
  const { state } = useUI();
  if (state.toasts.length === 0) return null;
```
- `return null` en React = ne rien afficher. Si pas de toasts, le composant ne monte même pas dans le DOM.

```typescript
  return (
    <View style={styles.container} pointerEvents="box-none">
```
- `pointerEvents="box-none"` : le conteneur lui-même ne bloque pas les touches, mais ses enfants (les toasts) oui.
- Sans ça, la zone du toast (même invisible) capturerait tous les taps, rendant les boutons en dessous inactifs.

```typescript
const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Sort du flux normal — se superpose aux autres éléments
    top: 60,              // 60px depuis le haut (sous la status bar)
    left: 16,
    right: 16,
    zIndex: 9999,         // Au-dessus de tout le reste
  },
```

---

## 16. features/auth/screens/SplashScreen.tsx

Écran affiché pendant la vérification du token stocké.

```typescript
export const SplashScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>🚀 Space Conquest Online</Text>
    <ActivityIndicator size="large" color={COLORS.info} style={styles.spinner} />
    <Text style={styles.subtitle}>Connexion en cours...</Text>
  </View>
);
```
- `ActivityIndicator` = le spinner de chargement natif iOS/Android
- Pas de logique ici : cet écran est purement déclaratif. La logique est dans `AuthContext`.

---

## 17. features/auth/screens/SignUpScreen.tsx

C'est l'écran principal de **l'US 1.1**.

### Les props de navigation

```typescript
type Props = StackScreenProps<AuthStackParamList, 'SignUp'>;

export const SignUpScreen = ({ navigation }: Props) => {
```
- `StackScreenProps<AuthStackParamList, 'SignUp'>` = type généré par React Navigation.
- `navigation` : objet qui permet de naviguer entre écrans (`navigation.navigate('Login')`)
- On destructure directement `{ navigation }` depuis les props.

### La gestion du formulaire

```typescript
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [touched, setTouched] = useState<TouchedFields>({
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
});
```
- Chaque champ a son propre state (contrôlé par React).
- `touched` : on ne montre les erreurs que sur les champs que l'utilisateur a déjà remplis et quittés. Sinon, dès l'ouverture de l'écran, tous les champs seraient en rouge — mauvaise UX.

```typescript
const markTouched = (field: keyof TouchedFields) =>
  setTouched((prev) => ({ ...prev, [field]: true }));
```
- `keyof TouchedFields` = TypeScript limite `field` aux clés de l'interface (`'username' | 'email' | ...`)
- `[field]: true` = syntaxe de propriété dynamique — équivalent à `{ username: true }` si `field === 'username'`

### La validation en temps réel

```typescript
const getErrors = (): FormErrors => {
  const errors: FormErrors = {};
  if (touched.username && !isValidUsername(username)) {
    errors.username = "3-20 caractères...";
  }
  // ...
  return errors;
};

const errors = getErrors();
```
- `getErrors()` est appelée **à chaque render** (pas dans un useEffect).
- Chaque fois que l'utilisateur tape une lettre, le composant re-rend, `getErrors()` recalcule, et les erreurs s'affichent/disparaissent instantanément.

```typescript
const isFormValid =
  isValidUsername(username) &&
  isValidEmail(email) &&
  isValidPassword(password) &&
  password === confirmPassword;
```
- Calculé à chaque render. Le bouton "S'inscrire" est `disabled={!isFormValid || loading}`.

### L'affichage conditionnel des erreurs

```typescript
{errors.username ? (
  <Text style={styles.errorText}>{errors.username}</Text>
) : null}
```
- `condition ? A : B` = ternaire — si `errors.username` est défini (truthy), affiche le `Text`, sinon `null`.

### La soumission

```typescript
const handleSubmit = async () => {
  setTouched({ username: true, email: true, password: true, confirmPassword: true });
  if (!isFormValid) return;

  const result = await execute({ username, email, password });
  if (!result.success && result.error) {
    showToast(result.error, 'error');
  }
};
```
- On marque tous les champs comme "touchés" au submit pour afficher toutes les erreurs si le formulaire est incomplet.
- Si le formulaire est invalide, on sort immédiatement (`return`).
- Si l'API retourne une erreur, on affiche un toast rouge.
- Si succès : `execute()` a dispatché `SET_USER` → `RootNavigator` navigue automatiquement vers `AppTabs` (pas besoin de `navigation.navigate`).

### Le KeyboardAvoidingView

```typescript
<KeyboardAvoidingView
  style={styles.keyboardView}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
```
- Sur mobile, quand le clavier s'ouvre, il peut masquer les champs de formulaire.
- `KeyboardAvoidingView` pousse le contenu vers le haut pour que les inputs restent visibles.
- `Platform.OS === 'ios' ? 'padding' : 'height'` : le comportement optimal est différent sur iOS et Android.

### Le ScrollView

```typescript
<ScrollView
  contentContainerStyle={styles.container}
  keyboardShouldPersistTaps="handled"
>
```
- `ScrollView` permet de scroller si le contenu dépasse l'écran (petits écrans, clavier ouvert).
- `keyboardShouldPersistTaps="handled"` : sans ça, taper sur le bouton "S'inscrire" fermerait d'abord le clavier avant d'exécuter l'action. Avec `"handled"`, le tap va directement au bouton.

---

## 18. features/auth/screens/LoginScreen.tsx

Même architecture que `SignUpScreen` mais plus simple (2 champs au lieu de 4). Les patterns sont identiques.

---

## 19. features/auth/screens/ProfileScreen.tsx

```typescript
const handleLogout = () => {
  Alert.alert(
    'Déconnexion',
    'Êtes-vous sûr de vouloir vous déconnecter ?',
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          showToast('Déconnexion réussie', 'info');
        },
      },
    ],
  );
};
```
- `Alert.alert(titre, message, boutons[])` : dialogue natif iOS/Android
- `style: 'destructive'` : le bouton s'affiche en rouge sur iOS (convention UX pour les actions irréversibles)
- `await logout()` : supprime le token du SecureStore ET dispatche `LOGOUT` → `RootNavigator` navigue vers `AuthStack`

---

## 20. navigation/NavigationTypes.ts

```typescript
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};
```
- Chaque clé est le nom d'un écran.
- La valeur est le type des **paramètres de navigation** de cet écran.
- `undefined` = cet écran ne reçoit pas de paramètres.
- Exemple avec paramètre : `SessionDetail: { sessionId: string }` → on pourrait faire `navigation.navigate('SessionDetail', { sessionId: '123' })`.

TypeScript utilise ces types pour :
- Vérifier que `navigation.navigate('Loginn')` est une erreur (typo)
- Inférer les types dans `route.params`

---

## 21. navigation/AuthStack.tsx

```typescript
const Stack = createStackNavigator<AuthStackParamList>();
```
- `createStackNavigator` crée un navigateur de type "pile" (stack) — on peut "empiler" des écrans et revenir en arrière.
- `<AuthStackParamList>` = générique TypeScript qui lie ce navigateur à nos types d'écrans.

```typescript
<Stack.Navigator
  initialRouteName="Login"
  screenOptions={{ headerShown: false }}
>
```
- `initialRouteName="Login"` : le premier écran affiché est Login
- `headerShown: false` : masque la barre de navigation en haut (header). On gère notre propre UI.

```typescript
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="SignUp" component={SignUpScreen} />
```
- Enregistre les écrans. `name` doit correspondre aux clés de `AuthStackParamList`.

---

## 22. navigation/AppTabs.tsx

```typescript
const Tab = createBottomTabNavigator<AppTabsParamList>();
```
- Navigateur avec onglets en bas de l'écran (obligatoire selon les contraintes du projet).

```typescript
<Tab.Navigator
  screenOptions={{
    tabBarStyle: {
      backgroundColor: COLORS.surface,
      borderTopColor: COLORS.border,
    },
    tabBarActiveTintColor: COLORS.info,    // Couleur de l'onglet actif
    tabBarInactiveTintColor: COLORS.textSecondary, // Couleur des onglets inactifs
  }}
>
```

Les écrans Lobby et Game sont des **placeholders** — des écrans vides en attendant l'implémentation des Épics 2 et 4.

---

## 23. navigation/RootNavigator.tsx

C'est le chef d'orchestre de la navigation protégée (US 1.3).

```typescript
export const RootNavigator = () => {
  const { state } = useAuth();

  return (
    <NavigationContainer>
      {state.isLoading ? (
        <SplashScreen />
      ) : state.user ? (
        <AppTabs />
      ) : (
        <AuthStack />
      )}
      <ToastContainer />
    </NavigationContainer>
  );
};
```

**L'algorithme de navigation protégée :**
1. `state.isLoading === true` → SplashScreen (on attend la vérification du token)
2. `state.isLoading === false` et `state.user !== null` → AppTabs (connecté)
3. `state.isLoading === false` et `state.user === null` → AuthStack (pas connecté)

**Pourquoi ça marche automatiquement ?**

Quand `AuthContext` change (ex: `dispatch({ type: 'SET_USER', payload: user })`), tous les composants qui utilisent `useAuth()` se re-rendent. `RootNavigator` reçoit le nouveau state, recalcule le ternaire, et affiche `AppTabs` au lieu de `AuthStack`. React Navigation gère la transition.

```typescript
<ToastContainer />
```
- Le `ToastContainer` est placé **à l'intérieur** de `NavigationContainer` mais **en dehors** des écrans de navigation.
- Il s'affiche par-dessus tout le reste grâce à `position: absolute` et `zIndex: 9999`.

---

## 24. App.tsx

```typescript
import 'react-native-gesture-handler';
```
- **Doit être la première ligne** (selon la documentation de React Navigation).
- `@react-navigation/stack` utilise ce module pour les gestes de navigation (swipe back sur iOS).
- L'import seul suffit — il n'y a rien à importer explicitement.

```typescript
export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AuthProvider>
    </UIProvider>
  );
}
```

**L'ordre des Providers est crucial :**

```
UIProvider (le plus externe)
└── AuthProvider
    └── RootNavigator
        └── NavigationContainer
            └── (SplashScreen | AuthStack | AppTabs)
                └── (LoginScreen | SignUpScreen | ProfileScreen | ...)
```

- `UIProvider` doit être le plus externe car `AuthProvider` (ou n'importe quel écran) peut appeler `showToast`.
- `AuthProvider` doit englober `RootNavigator` car `RootNavigator` lit `useAuth()`.
- `NavigationContainer` est à l'intérieur de tous les providers : les écrans ont besoin des contextes.

---

## 25. Les patterns réutilisés partout

### Pattern 1 : Hook avec `execute()` qui retourne `{ success, error }`

```typescript
// Dans un hook
const execute = async (params): Promise<{ success: boolean; error?: string }> => {
  try {
    // ... appel API ...
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
};

// Dans l'écran
const result = await execute(params);
if (!result.success && result.error) {
  showToast(result.error, 'error');
}
```

### Pattern 2 : Dispatch sans appel API direct

Les composants ne font **jamais** d'appel API directement. La chaîne est toujours :
```
Composant → Hook → Service → apiClient → API
                 ↘ dispatch(Context)
```

### Pattern 3 : Navigation pilotée par le State

On ne navigue **jamais** avec `navigation.navigate()` après une connexion réussie. On met à jour le state (`SET_USER`), et `RootNavigator` s'en charge automatiquement.

### Pattern 4 : Validation côté client + toast pour les erreurs API

- Erreurs de format (email invalide) = affichées sous le champ en temps réel
- Erreurs serveur (email déjà utilisé) = affichées via toast

### Pattern 5 : `finally` pour le loading

```typescript
setLoading(true);
try {
  // ...
} catch {
  // ...
} finally {
  setLoading(false); // Toujours exécuté
}
```
Sans `finally`, si le `try` plante et qu'on ne `setLoading(false)` que dans le `try`, le spinner de chargement ne s'arrêterait jamais en cas d'erreur.

---

## Glossaire rapide

| Terme | Définition |
|-------|------------|
| `async/await` | Syntaxe pour écrire du code asynchrone de façon lisible |
| `dispatch` | Fonction pour envoyer une action au reducer |
| `Interceptor` | Fonction qui s'exécute automatiquement avant/après chaque requête Axios |
| `Provider` | Composant React qui met un Context à disposition de ses enfants |
| `Reducer` | Fonction pure `(state, action) => newState` |
| `SecureStore` | Stockage chiffré par le hardware (Keychain iOS, Keystore Android) |
| `Stack Navigator` | Navigation en pile (Login → SignUp → retour possible) |
| `Tab Navigator` | Navigation par onglets en bas de l'écran |
| `useCallback` | Hook qui mémoïse une fonction pour éviter de la recréer à chaque render |
| `useContext` | Hook pour lire la valeur d'un Context |
| `useEffect` | Hook pour les effets de bord (appels API, souscriptions, timers) |
| `useReducer` | Hook alternative à `useState` pour les états complexes |
| `useRef` | Hook pour une référence mutable qui ne déclenche pas de re-render |
| `useState` | Hook pour l'état local d'un composant |
| `Bearer Token` | Type d'authentification HTTP : `Authorization: Bearer {token}` |
| `401` | Code HTTP "Non autorisé" → token invalide ou manquant |
| `TypeScript Generics` | `<T>` permet de paramétrer un type, ex: `Promise<string>` |
| `Optional Chaining` | `a?.b` → retourne `undefined` si `a` est null, plutôt que de planter |
| `Spread Operator` | `{ ...obj, key: value }` → copie l'objet et remplace/ajoute `key` |
