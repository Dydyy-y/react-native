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
import { useLogin } from '../hooks/useLogin';
import { useUI } from '../../ui';
import { COLORS } from '../../../shared/utils/constants';
import { isValidEmail } from '../../../shared/utils/validation';
import { authStyles as styles } from '../styles/authStyles';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const { loading, execute } = useLogin();
  const { showToast } = useUI();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const markTouched = (field: 'email' | 'password') =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const getErrors = () => ({
    email: touched.email && !isValidEmail(email)
      ? 'Adresse email invalide'
      : undefined,
    password: touched.password && password.length < 8
      ? 'Minimum 8 caracteres'
      : undefined,
  });

  const errors = getErrors();
  const isFormValid = isValidEmail(email) && password.length >= 8;

  const handleSubmit = async () => {
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    const result = await execute(email.trim(), password);
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
          <Text style={styles.title}>Se connecter</Text>
          <Text style={styles.subtitle}>Bienvenue sur Space Conquest Online</Text>
        </View>

        <View style={styles.form}>
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

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Pas encore inscrit ?{' '}
              <Text style={styles.linkAccent}>Creer un compte</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
