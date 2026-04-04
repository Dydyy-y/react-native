import { AxiosError } from 'axios';

/** Extrait un message d'erreur lisible depuis n'importe quelle erreur */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (typeof data?.message === 'string') return data.message;
    if (Array.isArray(data?.message)) return data.message.join(', ');
    return error.message || 'Une erreur serveur est survenue';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur inconnue est survenue';
};
