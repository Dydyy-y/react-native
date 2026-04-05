import { Alert, Platform } from 'react-native';

/**
 * Confirmation cross-platform.
 * - iOS/Android : utilise Alert.alert natif
 * - Web : utilise window.confirm (Alert.alert ne fonctionne pas sur le web)
 */
export const confirm = (
  title: string,
  message: string,
  onConfirm: () => void,
): void => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Confirmer', style: 'destructive', onPress: onConfirm },
  ]);
};
