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

// Etat global d'authentification, partage dans toute l'app via le context
interface AuthState {
  user: User | null;       // Profil utilisateur connecte (null si non authentifie)
  token: string | null;    // JWT stocke en memoire (SecureStore est le stockage persistant)
  isLoading: boolean;      // true pendant la verification du token au demarrage
  error: string | null;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
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
    case 'SET_AUTH':
      return { ...state, user: action.payload.user, token: action.payload.token };
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

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provider d'authentification. Au montage :
 * 1. Configure l'apiClient avec les callbacks (getToken pour les headers, logout sur 401)
 * 2. Verifie si un token est deja stocke dans SecureStore
 * 3. Si oui, valide le token aupres de l'API et recupere le profil
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Supprime le token du SecureStore et reset l'etat
  const logout = useCallback(async () => {
    await removeToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  // logoutRef evite que l'apiClient capture une version perimee de logout
  // car configureApiClient n'est appele qu'une seule fois au montage
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  // Injection des callbacks d'auth dans l'instance Axios partagee
  useEffect(() => {
    configureApiClient(getToken, () => logoutRef.current());
  }, []);

  // Verification du token stocke au demarrage de l'app
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const token = await getToken();
        if (!token) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
        const user = await getProfile();
        dispatch({ type: 'SET_AUTH', payload: { user, token } });
      } catch (error) {
        logger.error('Token validation failed:', error);
        // Token invalide ou expiré → nettoyage complet (SecureStore + state)
        await removeToken();
        dispatch({ type: 'SET_TOKEN', payload: null });
        dispatch({ type: 'SET_USER', payload: null });
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

// Hook pour acceder a l'etat d'auth et aux actions (dispatch, logout)
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
