import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY } from '../../../shared/utils/constants';

/**
 * expo-secure-store est natif uniquement (iOS/Android).
 * Sur le web, on utilise localStorage comme fallback pour le dev/test.
 */
const isWeb = Platform.OS === 'web';

// Chaque fonction teste isWeb car SecureStore n'est pas disponible sur navigateur.
// En production (iOS/Android), le token est chiffre par le hardware du device.

export const saveToken = async (token: string): Promise<void> => {
  if (isWeb) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  if (isWeb) {
    return localStorage.getItem(TOKEN_KEY);
  }
  return SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
