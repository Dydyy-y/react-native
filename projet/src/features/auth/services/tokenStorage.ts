import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY } from '../../../shared/utils/constants';

/** Sauvegarde le token JWT dans le stockage sécurisé (hardware-encrypted) */
export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

/** Récupère le token JWT depuis le stockage sécurisé */
export const getToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(TOKEN_KEY);
};

/** Supprime le token JWT du stockage sécurisé */
export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
