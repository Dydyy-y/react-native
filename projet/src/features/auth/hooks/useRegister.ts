import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { register, getProfile } from '../services/authService';
import { saveToken } from '../services/tokenStorage';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

interface ExecuteResult {
  success: boolean;
  error?: string;
}

interface UseRegisterReturn {
  loading: boolean;
  execute: (params: RegisterParams) => Promise<ExecuteResult>;
}

export const useRegister = (): UseRegisterReturn => {
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(false);

  const execute = async ({ name, email, password }: RegisterParams): Promise<ExecuteResult> => {
    setLoading(true);
    try {
      const response = await register(name, email, password);
      // Sauvegarde securisee du token
      await saveToken(response.access_token);
      dispatch({ type: 'SET_TOKEN', payload: response.access_token });
      // Recuperer le profil utilisateur (l'API ne le retourne pas dans la reponse register)
      const user = await getProfile();
      dispatch({ type: 'SET_USER', payload: user });
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  return { loading, execute };
};
