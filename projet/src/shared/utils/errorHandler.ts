import { AxiosError } from 'axios';

/** Traduction des messages d'erreur API courants en francais */
const ERROR_TRANSLATIONS: Record<string, string> = {
  'Invalid credentials': 'Email ou mot de passe incorrect',
  'The name field is required.': 'Le nom est requis',
  'The email field is required.': "L'email est requis",
  'The password field is required.': 'Le mot de passe est requis',
  'The email has already been taken.': 'Cette adresse email est deja utilisee',
  'The name has already been taken.': 'Ce nom est deja utilise',
  'The password confirmation does not match.': 'Les mots de passe ne correspondent pas',
  'The email field must be a valid email address.': "L'adresse email n'est pas valide",
};

/** Traduit un message d'erreur individuel */
const translateMessage = (message: string): string =>
  ERROR_TRANSLATIONS[message] ?? message;

/** Extrait un message d'erreur lisible depuis n'importe quelle erreur */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    // Format Laravel : { message: "msg", errors: { field: ["msg1", "msg2"] } }
    if (data?.errors && typeof data.errors === 'object') {
      const allErrors: string[] = [];
      for (const field of Object.keys(data.errors)) {
        const fieldErrors = data.errors[field];
        if (Array.isArray(fieldErrors)) {
          allErrors.push(...fieldErrors.map(translateMessage));
        }
      }
      if (allErrors.length > 0) return allErrors.join('\n');
    }

    // Message simple
    if (typeof data?.message === 'string') return translateMessage(data.message);
    if (Array.isArray(data?.message)) {
      return data.message.map(translateMessage).join('\n');
    }

    // Erreur reseau (pas de reponse du serveur)
    if (!error.response) return 'Erreur reseau — verifiez votre connexion internet';

    return error.message || 'Une erreur serveur est survenue';
  }

  if (error instanceof Error) return error.message;

  return 'Une erreur inconnue est survenue';
};
