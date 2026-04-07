import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';

type TokenGetter = () => Promise<string | null>;
type UnauthorizedHandler = () => void | Promise<void>;

// Configurés par AuthProvider au montage (pattern injection de dépendances)
let _getToken: TokenGetter | null = null;
let _onUnauthorized: UnauthorizedHandler | null = null;

/**
 * Configure le client Axios avec les callbacks d'auth.
 * Appelé une seule fois par AuthProvider.
 */
export const configureApiClient = (
  getToken: TokenGetter,
  onUnauthorized: UnauthorizedHandler,
): void => {
  _getToken = getToken;
  _onUnauthorized = onUnauthorized;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor requête : ajout automatique du token Bearer
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (_getToken) {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor réponse : gestion 401 → logout automatique
// On ignore les 401 sur les routes d'auth (login/register échouent normalement avec 401)
let _isLoggingOut = false;
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url || '';
    const isAuthRoute = url.startsWith('/auth/');
    if (error.response?.status === 401 && _onUnauthorized && !isAuthRoute && !_isLoggingOut) {
      _isLoggingOut = true;
      try {
        await _onUnauthorized();
      } finally {
        // Reset apres un court delai pour permettre un futur logout si necessaire
        setTimeout(() => { _isLoggingOut = false; }, 1000);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
