import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/NavigationTypes';
import { useRegister } from '../hooks/useRegister';
import { useUI } from '../../ui';
import { COLORS } from '../../../shared/utils/constants';
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
} from '../../../shared/utils/validation';
import { authStyles as styles } from '../styles/authStyles';

type Props = StackScreenProps<AuthStackParamList, 'SignUp'>;

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type TouchedFields = Record<keyof FormErrors, boolean>;

export const SignUpScreen = ({ navigation }: Props) => {
  const { loading, execute } = useRegister();
  const { showToast } = useUI();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState<TouchedFields>({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const markTouched = (field: keyof TouchedFields) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const getErrors = (): FormErrors => {
    const errors: FormErrors = {};
    if (touched.username && !isValidUsername(username)) {
      errors.username = "3-20 caractères, lettres, chiffres et _ uniquement";
    }
    if (touched.email && !isValidEmail(email)) {
      errors.email = 'Adresse email invalide';
    }
    if (touched.password && !isValidPassword(password)) {
      errors.password = 'Minimum 8 caractères';
    }
    if (touched.confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    return errors;
  };

  const errors = getErrors();

  const isFormValid =
    isValidUsername(username) &&
    isValidEmail(email) &&
    isValidPassword(password) &&
    password === confirmPassword;

  const handleSubmit = async () => {
    setTouched({ username: true, email: true, password: true, confirmPassword: true });
    if (!isFormValid) return;

    const result = await execute({ username, email, password });
    if (!result.success && result.error) {
      showToast(result.error, 'error');
    }
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
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez Space Conquest Online</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldContainer}>
            <TextInput
              style={[styles.input, errors.username ? styles.inputError : null]}
              placeholder="Nom d'utilisateur"
              placeholderTextColor={COLORS.textSecondary}
              value={username}
              onChangeText={setUsername}
              onBlur={() => markTouched('username')}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}
          </View>

          <View style={styles.fieldContainer}>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              onBlur={() => markTouched('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

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

          <View style={styles.fieldContainer}>
            <TextInput
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              placeholder="Confirmer mot de passe"
              placeholderTextColor={COLORS.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => markTouched('confirmPassword')}
              secureTextEntry
              editable={!loading}
            />
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, (!isFormValid || loading) ? styles.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Vous avez déjà un compte ?{' '}
              <Text style={styles.linkAccent}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
