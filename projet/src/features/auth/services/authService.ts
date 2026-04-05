import apiClient from '../../../shared/config/apiClient';
import { AuthResponse, User } from '../types/auth.types';

/** Inscription : POST /auth/register */
export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', {
    name,
    email,
    password,
    password_confirmation: password,
  });
  return response.data;
};

/** Connexion : POST /auth/login */
export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

/** Recuperation du profil utilisateur : GET /profile */
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>('/profile');
  return response.data;
};

/** Mise a jour du profil : PUT /profile */
export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await apiClient.put<User>('/profile', data);
  return response.data;
};
