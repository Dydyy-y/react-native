import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';

type TokenGetter = () => Promise<string | null>;
type UnauthorizedHandler = () => void;

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
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && _onUnauthorized) {
      _onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
