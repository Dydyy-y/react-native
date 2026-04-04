/** Username : 3-20 caractères, alphanumériques + underscore */
export const isValidUsername = (username: string): boolean =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username);

/** Email : format standard */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Password : minimum 8 caractères */
export const isValidPassword = (password: string): boolean =>
  password.length >= 8;
