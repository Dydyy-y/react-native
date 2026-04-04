import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../../ui';
import { COLORS } from '../../../shared/utils/constants';

/** Écran profil — affiche les infos utilisateur et le bouton de déconnexion */
export const ProfileScreen = () => {
  const { state, logout } = useAuth();
  const { showToast } = useUI();

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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <Text style={styles.value}>{state.user?.username}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{state.user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    marginTop: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    marginTop: 12,
  },
  value: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
