import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';

type TokenGetter = () => Promise<string | null>;
type UnauthorizedHandler = () => void | Promise<void>;

// Callbacks injectes par AuthProvider au montage.
// Ce pattern evite une dependance circulaire entre apiClient et AuthContext :
// l'apiClient n'importe pas le context, c'est le context qui s'enregistre ici.
let _getToken: TokenGetter | null = null;
let _onUnauthorized: UnauthorizedHandler | null = null;

// Appele une seule fois par AuthProvider au montage
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

// Interceptor requete : injecte le header Authorization sur chaque appel
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

// Interceptor reponse : si l'API renvoie 401, on deconnecte automatiquement.
// Exception : les routes /auth/* (login/register) qui retournent 401 normalement.
// _isLoggingOut empeche les appels recursifs si plusieurs requetes echouent en 401.
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
        _isLoggingOut = false;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
