# 🚀 Quick Start - Zustand Implementation

**Temps de cette étape** : 30 minutes de setup + 2-3 heures pour premier store

---

## Step 1 : Setup Initial (30 minutes)

```bash
# 1. Créer l'app Expo
npx create-expo-app@latest my-app --template with-typescript
cd my-app

# 2. Installer les dépendances
npm install zustand axios
npm install expo-secure-store expo-barcode-scanner expo-camera react-native-qrcode-svg
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# 3. Créer la structure
mkdir -p src/features/{auth,lobby,game,ui}/{store,services,screens,components,hooks,types}
mkdir -p src/shared/{components,hooks,utils,types,config}
mkdir -p src/navigation

# 4. Tester
npm start
# → Scan le QR code avec Expo Go
```

---

## Step 2 : Créer le Premier Store (15 minutes)

**Fichier** : `src/features/auth/store/authStore.ts`

```typescript
import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  // Actions  
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  user: null,
  token: null,
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, token: null, error: null }),
  clearError: () => set({ error: null }),
}));
```

✅ **C'est tout !** Un store Zustand = 30 lignes de code pur.

---

## Step 3 : Créer le Service Associé (20 minutes)

**Fichier** : `src/shared/config/apiClient.ts`

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://space-conquest-online.osc-fr1.scalingo.io/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Ajouter le token dans chaque requête
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      SecureStore.deleteItemAsync('TOKEN');
    }
    return Promise.reject(error);
  }
);
```

**Fichier** : `src/features/auth/services/authService.ts`

```typescript
import { apiClient } from '../../../shared/config/apiClient';
import * as SecureStore from 'expo-secure-store';
import { User } from '../store/authStore';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    await SecureStore.setItemAsync('TOKEN', response.data.token);
    return response.data;
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
    });
    await SecureStore.setItemAsync('TOKEN', response.data.token);
    return response.data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('TOKEN');
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync('TOKEN');
  },
};
```

---

## Step 4 : Créer un Hook Wrapper (optionnel, 10 minutes)

**Fichier** : `src/features/auth/hooks/useAuth.ts`

```typescript
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  // Selecteurs granulaires = directement depuis le store
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    user,
    token,
    loading,
    error,
    setUser,
    setToken,
    setLoading,
    setError,
    logout,
    clearError,
  };
};
```

---

## Step 5 : Créer le Fichier d'Export (5 minutes)

**Fichier** : `src/features/auth/index.ts`

```typescript
export { useAuthStore } from './store/authStore';
export { useAuth } from './hooks/useAuth';
export * from './types/auth.types';
export * as authService from './services/authService';
export { LoginScreen } from './screens/LoginScreen';
export { SignUpScreen } from './screens/SignUpScreen';
export { SplashScreen } from './screens/SplashScreen';
```

---

## Step 6 : Créer un Composant Test (20 minutes)

**Fichier** : `src/features/auth/screens/LoginScreen.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setToken, setLoading, setError, loading, error } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      // Navigation will auto-update via RootNavigator
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
        }}
      />

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007AFF',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Login
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
```

---

## Step 7 : Configurer la Navigation (20 minutes)

**Fichier** : `src/navigation/RootNavigator.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { LoginScreen, SignUpScreen, SplashScreen, useAuth } from '#/features/auth';
import { authService } from '#/features/auth/services/authService';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, setUser, setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await authService.getToken();
        // TODO: Si token existe, récupérer l'utilisateur depuis l'API
        // Pour now, juste savoir qu'on a un token
        if (token) {
          setToken(token);
          // Récupérer l'utilisateur (implémenter après)
        }
      } catch (e) {
        // Token expiré ou invalide
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user == null ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      ) : (
        // TODO: AppTabs Navigator for Lobby/Game
        <Stack.Navigator>
          <Stack.Screen name="Home" component={View} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
```

**Fichier** : `src/App.tsx`

```typescript
import React from 'react';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return <RootNavigator />;
}
```

---

## Step 8 : Répéter pour les Autres Stores

Créez les 3 autres stores avec le même pattern :

1. **lobbyStore.ts** (lobby feature)
2. **gameStore.ts** (game feature)
3. **uiStore.ts** (ui feature)

Chaque store = ~30-50 lignes Zustand

---

## ✅ Checklist

```
SETUP
□ npm install zustand + dépendances
□ Structure de dossiers créée

PREMIER STORE
□ authStore.ts créé (30 lignes)
□ authService.ts créé
□ useAuth.ts hook créé
□ LoginScreen.tsx composant test
□ RootNavigator.tsx setup

TEST
□ npm start fonctionne
□ Expo Go affiche l'app
□ LoginScreen visible
□ Aucune erreur de compilation

READY FOR EPIC 1
□ Oui → Allez faire l'authentification complète
```

---

## 🎯 Prochaines Étapes

1. Testez ce setup de base
2. Implementez l'authentification complète (Sign Up, Login, Logout)
3. Créez lobbyStore et lobbByFeatures
4. Créez gameStore et game features
5. Créez uiStore pour toasts/modals

---

**Status** : ✅ Prèt pour le coding  
**Date** : 24 mars 2026
