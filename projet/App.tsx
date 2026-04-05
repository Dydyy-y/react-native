import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { UIProvider } from './src/features/ui';
import { AuthProvider } from './src/features/auth';
import { LobbyProvider } from './src/features/lobby';
import { GameProvider } from './src/features/game';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastContainer } from './src/features/ui';

export default function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <LobbyProvider>
          <GameProvider>
            <NavigationContainer>
              <StatusBar style="light" />
              <RootNavigator />
              <ToastContainer />
            </NavigationContainer>
          </GameProvider>
        </LobbyProvider>
      </AuthProvider>
    </UIProvider>
  );
}
