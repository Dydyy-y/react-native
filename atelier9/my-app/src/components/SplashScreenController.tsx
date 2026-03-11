import * as SplashScreen from 'expo-splash-screen';
import { useSession } from '../contexts/SessionContext/useSession';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSession();
  console.log('SplashScreenController isLoading:', isLoading);

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
