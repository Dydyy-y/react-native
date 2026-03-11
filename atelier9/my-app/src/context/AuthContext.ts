import { createContext } from 'react';

export type AuthContextType = {
  isLoading: boolean;
};

// Fallback de secours si appel en dehors du Provider
const AuthContext = createContext<AuthContextType>({ isLoading: true });

export default AuthContext;
