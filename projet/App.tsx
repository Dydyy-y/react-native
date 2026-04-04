import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { UIProvider } from './src/features/ui';
import { AuthProvider } from './src/features/auth';
import { RootNavigator } from './src/navigation/RootNavigator';

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
