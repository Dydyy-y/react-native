export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}
