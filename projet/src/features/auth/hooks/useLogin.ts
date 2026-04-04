import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/authService';
import { saveToken } from '../services/tokenStorage';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

interface ExecuteResult {
  success: boolean;
  error?: string;
}

interface UseLoginReturn {
  loading: boolean;
  execute: (emailOrUsername: string, password: string) => Promise<ExecuteResult>;
}

export const useLogin = (): UseLoginReturn => {
  const { dispatch } = useAuth();
  const [loading, setLoading] = useState(false);

  const execute = async (
    emailOrUsername: string,
    password: string,
  ): Promise<ExecuteResult> => {
    setLoading(true);
    try {
      const response = await login(emailOrUsername, password);
      await saveToken(response.access_token);
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
