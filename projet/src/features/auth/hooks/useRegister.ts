import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { register } from '../services/authService';
import { saveToken } from '../services/tokenStorage';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

interface RegisterParams {
  username: string;
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

  const execute = async ({ username, email, password }: RegisterParams): Promise<ExecuteResult> => {
    setLoading(true);
    try {
      const response = await register(username, email, password);
      // Sauvegarde sécurisée du token
      await saveToken(response.access_token);
      // Mise à jour du contexte → déclenche la navigation vers AppTabs
      dispatch({ type: 'SET_TOKEN', payload: response.access_token });
      dispatch({ type: 'SET_USER', payload: response.user });
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  return { loading, execute };
};
