import React from 'react';
import { useAuth } from '../features/auth/contexts/AuthContext';
import { SplashScreen } from '../features/auth/screens/SplashScreen';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';

/**
 * Navigateur racine — gère la navigation protégée (US 1.3) :
 * - isLoading → SplashScreen (vérification du token)
 * - !user    → AuthStack (Login / SignUp)
 * - user     → AppTabs (Lobby, Game, Profile)
 */
export const RootNavigator = () => {
  const { state } = useAuth();

  if (state.isLoading) return <SplashScreen />;
  if (!state.user) return <AuthStack />;
  return <AppTabs />;
};
