import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LobbyStackParamList } from '../../../navigation/NavigationTypes';
import { useLobby } from '../hooks/useLobby';
import { useUI } from '../../ui';
import { QRDisplay } from '../components/QRDisplay';
import { COLORS } from '../../../shared/utils/constants';

type Props = StackScreenProps<LobbyStackParamList, 'CreateSession'>;

/** Ecran de creation de session + affichage QR code */
export const CreateSessionScreen = ({ navigation }: Props) => {
  const { session, loading, createSession } = useLobby();
  const { showToast } = useUI();
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    const result = await createSession(name.trim());
    if (!result.success) {
      showToast(result.error, 'error');
    }
  };

  // Si la session est créée, afficher le QR code + bouton pour aller au salon
  if (session) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Session creee !</Text>
        <Text style={styles.sessionName}>{session.name}</Text>

        <QRDisplay inviteCode={session.invite_code} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('SessionDetail')}
        >
          <Text style={styles.buttonText}>Aller au salon</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Formulaire de creation
  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Nouvelle session</Text>
        <Text style={styles.subtitle}>Choisissez un nom pour votre partie</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom de la partie"
          placeholderTextColor={COLORS.textSecondary}
          value={name}
          onChangeText={setName}
          maxLength={255}
          editable={!loading}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, (!name.trim() || loading) && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={!name.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Creer la session</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  sessionName: {
    fontSize: 16,
    color: COLORS.info,
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.info,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
