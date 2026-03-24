# PRD - Épic 1 : Inscription et Connexion

**Date** : 23 mars 2026  
**Version** : 1.0  
**Status** : À développer  
**Epic Estimate** : 13 points (3-4 jours)

---

## 1. Objectif Business

Permettre aux utilisateurs de créer un compte et de s'authentifier sécurisément pour accéder aux fonctionnalités du jeu "Space Conquest Online".

**Success Metrics** :
- ✅ Utilisateurs peuvent s'inscrire avec email valide et mot de passe
- ✅ Utilisateurs peuvent se connecter avec identifiants valides
- ✅ Token d'authentification stocké sécurisé et utilisé automatiquement
- ✅ Utilisateurs non-connectés ne peuvent pas accéder à l'app
- ✅ Erreurs claires affichées à l'utilisateur

---

## 2. User Stories

### US 1.1 - Créer un compte (Sign Up)

**En tant que** nouveau joueur  
**Je veux** créer un compte  
**Afin de** pouvoir jouer à Space Conquest Online

**Critères d'acceptation** :

1. **Interface SignUpScreen**
   - [ ] Title/Header : "Créer un compte"
   - [ ] Input username : Placeholder "Nom d'utilisateur"
   - [ ] Input email : Placeholder "Email"
   - [ ] Input password : Placeholder "Mot de passe" (type password, masqué)
   - [ ] Input confirm password : Placeholder "Confirmer mot de passe" (type password, masqué)
   - [ ] Button "S'inscrire" (disabled tant que form invalide)
   - [ ] Link "Vous avez déjà un compte ? Se connecter"

2. **Validations côté client**
   - [ ] Username : 3-20 caractères, alphanumériques + underscore
   - [ ] Email : Format email valide
   - [ ] Password : Min 8 caractères
   - [ ] Password === Confirm password
   - [ ] Les erreurs de validation affichées en temps réel
   - [ ] Erreurs en rouge sous chaque champ

3. **Appel API** (POST /register)
   - [ ] Body : `{ username, email, password }`
   - [ ] Response : `{ user: { id, username, email }, access_token, token_type, expires_in }`
   - [ ] En cas d'erreur API (email déjà utilisé, etc.) : afficher toast avec message d'erreur API

4. **Gestion State**
   - [ ] Loading state : button désactivé, spinner visible
   - [ ] Succès : redirection vers LoginScreen (ou directement AppTabs si auto-login)
   - [ ] Erreur : toast rouge, state reset, focus sur champ problématique

---

### US 1.2 - S'authentifier (Sign In)

**En tant que** joueur existant  
**Je veux** me connecter avec mes identifiants  
**Afin de** accéder à mes sessions de jeu

**Critères d'acceptation** :

1. **Interface LoginScreen**
   - [ ] Title/Header : "Se connecter"
   - [ ] Input email/username : Placeholder "Email ou nom d'utilisateur"
   - [ ] Input password : Placeholder "Mot de passe" (masqué)
   - [ ] Checkbox "Se souvenir de moi" (optionnel, v1)
   - [ ] Button "Se connecter" (disabled tant que form invalide)
   - [ ] Link "Pas encore inscrit ? Créer un compte"
   - [ ] [BONUS] Link "Mot de passe oublié ?"

2. **Validations côté client**
   - [ ] Email/username : Non-vide
   - [ ] Password : Non-vide, min 8 caractères affichés
   - [ ] Erreurs affichées en rouge

3. **Appel API** (POST /login)
   - [ ] Body : `{ email_or_username, password }`
   - [ ] Response : `{ user: { id, username, email }, access_token, token_type, expires_in }`
   - [ ] En cas d'erreur (credentials invalides) : afficher toast "Email/password invalides"
   - [ ] Header Authorization automatiquement ajouté pour requêtes futures

4. **Gestion State & Stockage**
   - [ ] Token stocké dans Secure Storage (`expo-secure-store`)
   - [ ] User stocké dans AuthContext
   - [ ] Loading state pendant requête
   - [ ] Succès : redirection automatique vers AppTabs (Lobby)
   - [ ] Erreur : toast rouge, state reset, focus sur champ

5. **Récupération au démarrage App**
   - [ ] Au montage App : vérifier si token en Secure Storage
   - [ ] Si token exist : afficher SplashScreen (loading), valider token avec API (GET /me)
   - [ ] Si token valide : loader user + redirection automatique AppTabs
   - [ ] Si token invalide/expiré : redirection LoginScreen, token supprimé

---

### US 1.3 - Navigation Protégée

**En tant que** utilisateur  
**Je veux** que l'app me protège des accès non-autorisés  
**Afin de** que mes données restent privées

**Critères d'acceptation** :

1. **RootNavigator Logic**
   - [ ] `isLoading=true` → SplashScreen (vérifier token)
   - [ ] `isLoading=false && !user` → AuthStack (LoginScreen/SignUpScreen)
   - [ ] `isLoading=false && user` → AppTabs (Lobby, Game, etc.)

2. **Logout / Déconnexion**
   - [ ] Button logout visible dans Profile ou Settings (bonus)
   - [ ] Action logout : supprimer token de Secure Storage + clear AuthContext + redirection LoginScreen
   - [ ] Message confirmation avant logout

3. **Gestion Token dans Requests**
   - [ ] Interceptor Axios/Fetch : ajouter `Authorization: Bearer ${token}` si existe
   - [ ] Gestion 401 : logout automatique + redirection LoginScreen
   - [ ] Gestion 403 : toast erreur

4. **Edge Cases**
   - [ ] Token expiré (>24h) : logout + redirection (bonus : refresh token)
   - [ ] Token invalide : logout + redirection
   - [ ] Offline mode : afficher message, permettre retry

---

## 3. Acceptance Tests

| Test ID | Scenario | Expected | Pass/Fail |
|---------|----------|----------|-----------|
| T1.1.1 | Créer compte : email invalide | Toast erreur, form reset | |
| T1.1.2 | Créer compte : password ≠ confirm password | Erreur affichée, submit disabled | |
| T1.1.3 | Créer compte : email déjà utilisé | Toast API error | |
| T1.1.4 | Créer compte : succès | Redirect LoginScreen | |
| T1.2.1 | Login : token invalide | Toast erreur, form reset | |
| T1.2.2 | Login : succès | Redirect AppTabs, token en storage | |
| T1.3.1 | App startup + token valide | Auto-redirect AppTabs | |
| T1.3.2 | App startup + token invalide | Auto-redirect LoginScreen | |
| T1.3.3 | 401 response during request | Auto-logout + LoginScreen | |

---

## 4. Technical Details

### AuthContext
```typescript
// State
{
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Actions
- SET_USER(user: User)
- SET_TOKEN(token: string)
- SET_LOADING(bool)
- SET_ERROR(error: string)
- LOGOUT()
- CLEAR_ERROR()
```

### Services
- **`authService.register(username, email, password)`**
- **`authService.login(emailOrUsername, password)`**
- **`authService.logout()`**
- **`authService.validateToken()`**
- **`tokenStorage.saveToken(token)`**
- **`tokenStorage.getToken()`**
- **`tokenStorage.removeToken()`**

### Hooks
- **`useAuth()`** : Return { user, token, isLoading, error, login, register, logout }
- **`useSecureStorage()`** : Return { saveToken, getToken, removeToken }

### API Endpoints
- `POST /register` → Register
- `POST /login` → Login
- `GET /me` → Validate token & get current user

---

## 5. UI/UX Guidelines

- Clean, modern design (Expo UI library ou custom)
- Form validation feedback en temps réel
- Loading spinner pendant requests API
- Toast notifications pour succès/erreurs
- Couleurs : 
  - Succès : #4CAF50 (vert)
  - Erreur : #f44336 (rouge)
  - Info : #2196F3 (bleu)

---

## 6. Définition de Done

- [ ] Code écrit en TypeScript
- [ ] Tests des 3 US complétés
- [ ] All acceptance tests pass
- [ ] Error handling robuste
- [ ] Secure token storage implémenté
- [ ] Navigation protégée fonctionnelle
- [ ] Code review + commentaires pertinents

---

