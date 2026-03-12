import { useEffect, useState } from 'react';
import SessionContext from './SessionContext';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // En attendant le vrai appel AsyncStorage
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const login = () => {};
  const logout = () => {};

  return (
    <SessionContext.Provider value={{ isLoading, session, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
