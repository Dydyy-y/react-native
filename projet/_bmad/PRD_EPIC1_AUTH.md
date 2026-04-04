# PRD - Étape 1 : Inscription et Connexion

**Date** : 23 mars 2026 (mis à jour 04 avril 2026)  
**Version** : 2.0  
**Status** : ✅ Terminé  
**Sprint** : 1

---

## 1. Objectif

Permettre aux utilisateurs de créer un compte et de s'authentifier sécurisément pour accéder aux fonctionnalités du jeu "Space Conquest Online".

**Critères de succès** :
- Utilisateurs peuvent s'inscrire avec username, email et mot de passe
- Utilisateurs peuvent se connecter avec identifiants valides
- Token d'authentification stocké dans `expo-secure-store` et utilisé automatiquement
- Utilisateurs non-connectés ne peuvent pas accéder à l'app
- Erreurs claires affichées via le système de toasts

---

## 2. User Stories

### US 1.1 - Créer un compte (Sign Up)

**En tant que** nouveau joueur  
**Je veux** créer un compte  
**Afin de** pouvoir jouer à Space Conquest Online

**Critères d'acceptation** :

1. **Interface SignUpScreen**
   - [x] Title : "Créer un compte"
   - [x] Input username : placeholder "Nom d'utilisateur"
   - [x] Input email : placeholder "Email"
   - [x] Input password : masked
   - [x] Input confirm password : masked
   - [x] Button "S'inscrire" (disabled tant que form invalide)
   - [x] Link "Vous avez déjà un compte ? Se connecter"

2. **Validations côté client**
   - [x] Username : 3-20 caractères, alphanumériques + underscore
   - [x] Email : format email valide
   - [x] Password : min 8 caractères
   - [x] Password === Confirm password
   - [x] Erreurs affichées en temps réel (onBlur) en rouge sous chaque champ

3. **Appel API** (POST /auth/register)
   - [x] Body : `{ username, email, password }`
   - [x] En cas d'erreur API : toast via UIContext

4. **Gestion State (Context API + useReducer)**
   - [x] Hook `useRegister` gère loading/error
   - [x] Succès : token sauvegardé dans expo-secure-store + dispatch SET_TOKEN/SET_USER dans AuthContext
   - [x] Navigation automatique vers AppTabs via RootNavigator

---

### US 1.2 - S'authentifier (Sign In)

**En tant que** joueur existant  
**Je veux** me connecter avec mes identifiants  
**Afin d'** accéder à mes sessions de jeu

**Critères d'acceptation** :

1. **Interface LoginScreen**
   - [x] Title : "Se connecter"
   - [x] Input email/username : placeholder "Email ou nom d'utilisateur"
   - [x] Input password : masked
   - [x] Button "Se connecter" (disabled tant que form invalide)
   - [x] Link "Pas encore inscrit ? Créer un compte"

2. **Validations côté client**
   - [x] Email/username : non-vide
   - [x] Password : min 8 caractères

3. **Appel API** (POST /auth/login)
   - [x] Body : `{ email_or_username, password }`
   - [x] Header Authorization ajouté automatiquement par interceptor Axios

4. **Gestion State (Context API + useReducer)**
   - [x] Hook `useLogin` gère loading/error
   - [x] Token stocké dans expo-secure-store
   - [x] Succès : dispatch SET_TOKEN/SET_USER -> navigation auto vers AppTabs

5. **Récupération au démarrage App**
   - [x] Au montage AuthProvider : vérifier token dans expo-secure-store
   - [x] Si token existe : GET /auth/me pour valider
   - [x] Si valide : charger user + navigation auto vers AppTabs
   - [x] Si invalide/expiré : supprimer token, afficher LoginScreen

---

### US 1.3 - Navigation Protégée

**En tant qu'** utilisateur  
**Je veux** que l'app protège les accès non-autorisés  
**Afin que** mes données restent privées

**Critères d'acceptation** :

1. **RootNavigator Logic**
   - [x] `isLoading=true` -> SplashScreen
   - [x] `isLoading=false && !user` -> AuthStack
   - [x] `isLoading=false && user` -> AppTabs

2. **Logout / Déconnexion**
   - [x] Bouton dans ProfileScreen
   - [x] Confirmation modale (Alert)
   - [x] Supprimer token + dispatch LOGOUT + redirection auto

3. **Gestion Token dans les requêtes**
   - [x] Interceptor Axios : ajoute `Authorization: Bearer {token}`
   - [x] Gestion 401 : logout automatique via callback injectée
   - [x] Configuration apiClient via `configureApiClient()` (injection de dépendances)

---

## 3. Détails Techniques

### AuthContext (Context API + useReducer)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };
```

### Services
- `authService.register(username, email, password)` -> POST /auth/register
- `authService.login(emailOrUsername, password)` -> POST /auth/login
- `authService.validateToken()` -> GET /auth/me
- `tokenStorage.saveToken(token)` / `getToken()` / `removeToken()`

### Hooks (récupération API)
- `useLogin()` -> { loading, execute }
- `useRegister()` -> { loading, execute }

### API Endpoints
- `POST /auth/register` -> Register
- `POST /auth/login` -> Login
- `GET /auth/me` -> Validate token & get current user

---

## 4. Fichiers Implémentés

```
src/features/auth/
├── contexts/AuthContext.tsx     (Context + Reducer + Provider + useAuth)
├── services/
│   ├── authService.ts          (appels API)
│   └── tokenStorage.ts         (expo-secure-store wrapper)
├── hooks/
│   ├── useLogin.ts             (hook récupération API login)
│   └── useRegister.ts          (hook récupération API register)
├── screens/
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── SplashScreen.tsx
│   └── ProfileScreen.tsx
├── types/auth.types.ts
└── index.ts

src/features/ui/
├── contexts/UIContext.tsx       (Context + Reducer + Provider + useUI)
├── components/Toast.tsx         (ToastContainer overlay)
└── index.ts

src/shared/
├── config/apiClient.ts         (Axios + interceptors + injection callbacks)
├── utils/
│   ├── constants.ts            (API_BASE_URL, TOKEN_KEY, COLORS)
│   ├── validation.ts           (isValidUsername, isValidEmail, isValidPassword)
│   ├── errorHandler.ts         (getErrorMessage)
│   └── logger.ts
└── types/common.types.ts       (ApiError)

src/navigation/
├── RootNavigator.tsx           (auth conditionnel)
├── AuthStack.tsx               (Login + SignUp)
├── AppTabs.tsx                 (TabsNavigator obligatoire)
└── NavigationTypes.ts
```
