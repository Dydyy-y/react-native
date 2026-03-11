import { createContext } from 'react';

type SessionUser = {
  name: string;
};

export type SessionContextType = {
  isLoading: boolean;
  session: SessionUser | null;
  login: () => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextType>({
  isLoading: true, // Fallback de secours si appel en dehors du Provider
  session: null,
  login: () => {},
  logout: () => {},
});

export default SessionContext;
