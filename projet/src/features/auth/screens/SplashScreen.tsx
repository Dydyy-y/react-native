import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../../shared/utils/constants';

/** Écran affiché pendant la vérification du token stocké au démarrage */
export const SplashScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>🚀 Space Conquest Online</Text>
    <ActivityIndicator size="large" color={COLORS.info} style={styles.spinner} />
    <Text style={styles.subtitle}>Connexion en cours...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 48,
  },
  spinner: {
    marginBottom: 20,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
