export interface User {
  id: number;
  name: string;
  email: string;
}

/** Reponse de POST /auth/login et POST /auth/register */
export interface AuthResponse {
  access_token: string;
  access_expires_at: string;
  refresh_token: string;
  refresh_expires_at: string;
}
