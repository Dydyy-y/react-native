/** Email : format standard */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Password : minimum 8 caractères */
export const isValidPassword = (password: string): boolean =>
  password.length >= 8;
