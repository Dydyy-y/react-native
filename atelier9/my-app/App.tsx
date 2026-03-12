import { StatusBar } from 'expo-status-bar';
import { SessionProvider } from './src/contexts/SessionContext/SessionProvider';
import { SplashScreenController } from './src/components/SplashScreenController';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
      <StatusBar style="auto" />
    </SessionProvider>
  );
}
