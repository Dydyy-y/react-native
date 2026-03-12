import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useSession } from '../contexts/SessionContext/useSession';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}
