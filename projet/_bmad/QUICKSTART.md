# QUICKSTART - Getting Started with Development

**Temps de lecture** : 5 minutes  
**Temps setup** : 30 minutes  
**Temps avant coding** : 1 heure

---

## 🎯 Objectif Immédiat

Vous avez une documentation complète. Voici le minimum pour **commencer à coder maintenant**.

---

## ⚡ 3 Étapes Essentielles

### Step 1 : Lire Architecture en 10 min

Ouvrez [ARCHITECTURE.md](ARCHITECTURE.md) et lisez **SEULEMENT** :
1. Section 1 : Vue d'ensemble (diagramme)
2. Section 2 : Structure du projet (folder tree)
3. Section 3 : Gestion d'état (les 4 contexts)
4. Section 4 : Navigation

**Pourquoi ?** Pour comprendre où mettre quoi.

---

### Step 2 : Noter les Constraints

Écrivez ou copier-coller ceci dans votre `TODO.txt` :

```
CONSTRAINTS
===========
✓ React Native + Expo
✓ TypeScript (strict mode)
✓ Context API + useReducer (NO Redux)
✓ Axios for API
✓ expo-secure-store for tokens
✓ API Base URL: https://space-conquest-online.osc-fr1.scalingo.io/api
✓ Rate Limit: 20 req/min GLOBAL
✓ Polling: 30s minimum interval
✓ QR Scanner: expo-barcode-scanner + expo-camera

DÉPENDANCES ÉPIQUES
===================
Épic 1 (Auth)  → Épic 2 (Lobby) → Épic 3 (Moderation) → Épic 4 (Game)
```

---

### Step 3 : Clone et Setup (30 min)

```bash
# 1. Créer nouveau projet Expo
npx create-expo-app@latest my-app --template with-typescript
cd my-app

# 2. Installer les dépendances clés
npm install axios
npm install expo-secure-store
npm install expo-barcode-scanner expo-camera
npm install react-native-qrcode-svg
npm install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context

# 3. Créer la structure de folders
mkdir -p src/{app,contexts,hooks,services/{api,auth,game,qr},screens/{auth,lobby,game},components/{common,game,lobby,auth},types,utils,config}

# 4. Créer les fichiers clés
touch src/app/App.tsx
touch src/app/RootNavigator.tsx
touch src/app/Navigation.tsx
touch src/contexts/AuthContext.tsx
touch src/contexts/LobbyContext.tsx
touch src/contexts/GameContext.tsx
touch src/hooks/useAuth.ts
touch src/hooks/useLobby.ts
touch src/hooks/useGame.ts
touch src/types/api.types.ts
touch src/config/apiConfig.ts

# 5. Test
npm start
```

---

## 🛠️ Avant de Coder : Checklist Rapide

- [ ] Repo créé sur GitHub (public)
- [ ] Project Expo fonctionnel (npm start)
- [ ] Folder structure créé selon [ARCHITECTURE.md](ARCHITECTURE.md)
- [ ] TypeScript enabled (tsconfig.json)
- [ ] `.gitignore` a `node_modules`, `.env`, `*.log`
- [ ] `.env.example` créé (voir exemple ci-dessous)
- [ ] Package.json noté avec versions

---

## 📝 .env.example

Créez `.env.example` à la racine :

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://space-conquest-online.osc-fr1.scalingo.io/api
EXPO_PUBLIC_API_TIMEOUT=10000

# Polling
EXPO_PUBLIC_POLLING_INTERVAL=30000

# Debug
EXPO_PUBLIC_LOG_LEVEL=info
```

Et votre `.env` local :
```env
EXPO_PUBLIC_API_BASE_URL=https://space-conquest-online.osc-fr1.scalingo.io/api
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_POLLING_INTERVAL=30000
EXPO_PUBLIC_LOG_LEVEL=debug
```

---

## 🚀 Commencer par Épic 1 (Auth)

### 1. Lire le PRD (30 min)

Ouvrez [PRD_EPIC1_AUTH.md](PRD_EPIC1_AUTH.md) et noter :
- **US 1.1** : Form Sign Up (inputs, validation)
- **US 1.2** : Form Sign In (inputs, validation)
- **US 1.3** : Protected navigation (RootNavigator logic)
- **Section 4 (Technical Details)** : Context, Services, Hooks

---

### 2. Implémenter dans Cet Ordre

```
Jour 1 : Services + Context
├─ src/services/api/client.ts (Axios setup)
├─ src/services/auth/tokenStorage.ts (SecureStore)
├─ src/services/auth/authService.ts (API calls)
└─ src/contexts/AuthContext.tsx (Context + Reducer)

Jour 2 : Screens + Navigation
├─ src/screens/auth/LoginScreen.tsx
├─ src/screens/auth/SignUpScreen.tsx
├─ src/app/Navigation.tsx (Auth vs App stacks)
└─ src/app/RootNavigator.tsx (Login/Loading logic)

Jour 3 : Hooks + Polish
├─ src/hooks/useAuth.ts
├─ src/hooks/useSecureStorage.ts
├─ Error handling + validation
└─ Test manuel (register, login, logout)
```

---

## 📋 Testing Checklist Minmal pour Épic 1

Une fois Épic 1 codé, testez ceci :

- [ ] Sign Up : form validation works
- [ ] Sign Up : email unique validation via API
- [ ] Sign Up : password == confirm password
- [ ] Sign Up : success → redirect LoginScreen
- [ ] Sign In : login with valid credentials → AppTabs
- [ ] Sign In : login with invalid credentials → error toast
- [ ] Token in SecureStore after login
- [ ] App restart + token valid → auto AppTabs
- [ ] App restart + no token → LoginScreen
- [ ] 401 response → logout + LoginScreen
- [ ] Logout button → LoginScreen + token deleted

---

## 💡 Tips pour Éviter Bugs Communs

### Auth
- ✅ Token stored/retrieved correctement dans SecureStore
- ✅ axios interceptor ajoute Authorization header
- ✅ 401 handling logout proprement
- ✅ useEffect cleanup pour éviter memory leaks

### Lobby Polling
- ✅ Polling arrête quand screen unmounted
- ✅ Pas de requêtes redondantes
- ✅ Respecte rate limit (30s min)
- ✅ Erreur réseau → retry après 30s (pas crash)

### Moderation
- ✅ Boutons visibles SEULEMENT si creator
- ✅ Confirmation modale avant action destructive
- ✅ Polling détecte auto-redirect si session supprimée/banned

### Game Map
- ✅ Grille responsive (scroll si > viewport)
- ✅ Ressources + vaisseaux affichés aux bonnes coords
- [ ] z-index correct (vaisseaux > ressources > grille)

---

## 🐛 Debugging Tips

### VS Code Extensions
Installez pour meilleure exp:
```
- ES7+ React/Redux/React-Native snippets
- TypeScriptimport Statements
- Prettier
- ESLint
```

### React Native Debugger
```bash
# Install globally
npm install -g react-native-debugger

# Open devtools in app
Ctrl+D (Android) ou Cmd+D (iOS)
```

### Logging Helper
Créez `src/utils/logger.ts` :

```typescript
const LOG_LEVEL = process.env.EXPO_PUBLIC_LOG_LEVEL || 'info';

export const logger = {
  debug: (msg: string, data?: any) => {
    if (LOG_LEVEL === 'debug') console.log(`[DEBUG] ${msg}`, data);
  },
  info: (msg: string, data?: any) => {
    console.log(`[INFO] ${msg}`, data);
  },
  error: (msg: string, error?: any) => {
    console.error(`[ERROR] ${msg}`, error);
  },
};
```

---

## 📊 Tracking Progression

Maintenant que architecture est défini, trackez ainsi :

```markdown
# Space Conquest Online - Implementation Tracker

## Épic 1 : Auth (13 pts)
- [ ] Services : API client, tokenStorage, authService
- [ ] Context : AuthContext + Reducer
- [ ] Screens : LoginScreen, SignUpScreen, SplashScreen
- [ ] Navigation : RootNavigator logic
- [ ] Hooks : useAuth, useSecureStorage
- [x] Done : Tests manuels passed

## Épic 2 : Lobby (21 pts)
- [ ] ...à venir après Épic 1

...
```

---

## 💬 Final Words

Vous avez maintenant :
- ✅ Architecture complète
- ✅ 4 PRDs détaillés avec acceptance criteria
- ✅ Sprint planning de 4 semaines
- ✅ Dépendances listées
- ✅ Standards & best practices

**Prochaine étape** : Commencer le coding par Épic 1 !

Pour chaque question :
1. Cherchez dans [INDEX.md](INDEX.md)
2. Relisez section "Technical Details" du PRD approprié
3. Vérifiez l'acceptance criteria

---

**C'est l'heure de coder ! 💪**

