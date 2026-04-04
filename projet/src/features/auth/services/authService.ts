import apiClient from '../../../shared/config/apiClient';
import { AuthResponse, User } from '../types/auth.types';

/** Inscription : POST /auth/register */
export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
};

/** Connexion : POST /auth/login */
export const login = async (
  emailOrUsername: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    email_or_username: emailOrUsername,
    password,
  });
  return response.data;
};

/** Validation du token et récupération de l'utilisateur courant : GET /auth/me */
export const validateToken = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};
