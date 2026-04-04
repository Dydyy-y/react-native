import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/NavigationTypes';
import { useLogin } from '../hooks/useLogin';
import { useUI } from '../../ui';
import { COLORS } from '../../../shared/utils/constants';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const { loading, execute } = useLogin();
  const { showToast } = useUI();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ emailOrUsername: false, password: false });

  const markTouched = (field: 'emailOrUsername' | 'password') =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const getErrors = () => ({
    emailOrUsername: touched.emailOrUsername && !emailOrUsername.trim()
      ? 'Ce champ est requis'
      : undefined,
    password: touched.password && password.length < 8
      ? 'Minimum 8 caractères'
      : undefined,
  });

  const errors = getErrors();
  const isFormValid = emailOrUsername.trim().length > 0 && password.length >= 8;

  const handleSubmit = async () => {
    setTouched({ emailOrUsername: true, password: true });
    if (!isFormValid) return;

    const result = await execute(emailOrUsername.trim(), password);
    if (!result.success && result.error) {
      showToast(result.error, 'error');
    }
    // En cas de succès : AuthContext met à jour user → RootNavigator navigue vers AppTabs
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Se connecter</Text>
          <Text style={styles.subtitle}>Bienvenue sur Space Conquest Online</Text>
        </View>

        <View style={styles.form}>
          {/* Email ou nom d'utilisateur */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={[styles.input, errors.emailOrUsername ? styles.inputError : null]}
              placeholder="Email ou nom d'utilisateur"
              placeholderTextColor={COLORS.textSecondary}
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              onBlur={() => markTouched('emailOrUsername')}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.emailOrUsername ? (
              <Text style={styles.errorText}>{errors.emailOrUsername}</Text>
            ) : null}
          </View>

          {/* Mot de passe */}
          <View style={styles.fieldContainer}>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              onBlur={() => markTouched('password')}
              secureTextEntry
              editable={!loading}
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Bouton Se connecter */}
          <TouchableOpacity
            style={[styles.button, (!isFormValid || loading) ? styles.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Lien vers Inscription */}
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Pas encore inscrit ?{' '}
              <Text style={styles.linkAccent}>Créer un compte</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  form: {
    width: '100%',
  },
  fieldContainer: {
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
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: COLORS.info,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  linkAccent: {
    color: COLORS.info,
    fontWeight: '600',
  },
});
