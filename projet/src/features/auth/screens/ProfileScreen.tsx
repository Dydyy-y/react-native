import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../../navigation/NavigationTypes';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../../ui';
import { updateProfile, UpdateProfileData } from '../services/authService';
import { COLORS } from '../../../shared/utils/constants';
import { confirm } from '../../../shared/utils/confirm';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

/** Ecran profil — affichage, modification, deconnexion */
export const ProfileScreen = () => {
  const { state, dispatch, logout } = useAuth();
  const { showToast } = useUI();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(state.user?.name ?? '');
  const [email, setEmail] = useState(state.user?.email ?? '');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    confirm(
      'Deconnexion',
      'Etes-vous sur de vouloir vous deconnecter ?',
      async () => {
        await logout();
        showToast('Deconnexion reussie', 'info');
      },
    );
  };

  const handleStartEdit = () => {
    setName(state.user?.name ?? '');
    setEmail(state.user?.email ?? '');
    setPassword('');
    setPasswordConfirm('');
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    // Validation basique
    if (!name.trim()) {
      showToast('Le nom est requis', 'error');
      return;
    }
    if (!email.trim()) {
      showToast("L'email est requis", 'error');
      return;
    }
    if (password && password !== passwordConfirm) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    if (password && password.length < 8) {
      showToast('Le mot de passe doit faire au moins 8 caracteres', 'error');
      return;
    }

    const data: UpdateProfileData = {};
    if (name.trim() !== state.user?.name) data.name = name.trim();
    if (email.trim() !== state.user?.email) data.email = email.trim();
    if (password) {
      data.password = password;
      data.password_confirmation = passwordConfirm;
    }

    // Rien n'a change
    if (Object.keys(data).length === 0) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await updateProfile(data);
      dispatch({ type: 'SET_USER', payload: updatedUser });
      showToast('Profil mis a jour', 'success');
      setEditing(false);
      setPassword('');
      setPasswordConfirm('');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={48} color={COLORS.info} />
          <Text style={styles.cardTitle}>Mon Profil</Text>
        </View>

        {!editing ? (
          /* ─── Mode affichage ──────────────────── */
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>{state.user?.name}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{state.user?.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleStartEdit}>
              <Ionicons name="create-outline" size={18} color={COLORS.white} />
              <Text style={styles.editButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* ─── Mode edition ────────────────────── */
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Votre nom"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Votre email"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Nouveau mot de passe (optionnel)</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Laisser vide pour ne pas changer"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry
              />
            </View>
            {password.length > 0 && (
              <View style={styles.field}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                  style={styles.input}
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor={COLORS.textSecondary}
                  secureTextEntry
                />
              </View>
            )}
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={18} color={COLORS.white} />
                    <Text style={styles.saveButtonText}>Enregistrer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Bouton historique des parties */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('GameHistory')}
      >
        <Ionicons name="time-outline" size={20} color={COLORS.white} />
        <Text style={styles.historyButtonText}>Historique des parties</Text>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.logoutText}>Se deconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  value: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
    gap: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 8,
    padding: 14,
    gap: 8,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  historyButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    gap: 8,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
