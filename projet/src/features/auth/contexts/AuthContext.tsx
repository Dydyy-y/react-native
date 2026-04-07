import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  ReactNode,
} from 'react';
import { User } from '../types/auth.types';
import { getToken, removeToken } from '../services/tokenStorage';
import { getProfile } from '../services/authService';
import { configureApiClient } from '../../../shared/config/apiClient';
import { logger } from '../../../shared/utils/logger';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true, // true par défaut : vérification du token stocké au démarrage
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = useCallback(async () => {
    await removeToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Ref pour éviter les closures périmées dans la config de l'apiClient
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  // Configure l'apiClient avec les callbacks d'auth (une seule fois au montage)
  useEffect(() => {
    configureApiClient(getToken, () => logoutRef.current());
  }, []);

  // Vérifie le token stocké au démarrage de l'app
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const token = await getToken();
        if (!token) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        // Valide le token avec l'API et recupere l'utilisateur
        const user = await getProfile();
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        logger.error('Token validation failed:', error);
        // Token invalide ou expiré → nettoyage
        await removeToken();
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkStoredToken();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
