import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../features/auth/contexts/AuthContext';
import { SplashScreen } from '../features/auth/screens/SplashScreen';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { ToastContainer } from '../features/ui/components/Toast';

/**
 * Navigateur racine — gère la navigation protégée (US 1.3) :
 * - isLoading → SplashScreen (vérification du token)
 * - !user    → AuthStack (Login / SignUp)
 * - user     → AppTabs (Lobby, Game, Profile)
 */
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
      {/* Overlay global des notifications toast */}
      <ToastContainer />
    </NavigationContainer>
  );
};
