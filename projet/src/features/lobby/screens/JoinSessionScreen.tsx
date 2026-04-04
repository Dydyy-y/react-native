import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LobbyStackParamList } from '../../../navigation/NavigationTypes';
import { useLobby } from '../hooks/useLobby';
import { useUI } from '../../ui';
import { QRScanner } from '../components/QRScanner';
import { COLORS } from '../../../shared/utils/constants';

type Props = StackScreenProps<LobbyStackParamList, 'JoinSession'>;

/** Ecran de scan QR code pour rejoindre une session */
export const JoinSessionScreen = ({ navigation }: Props) => {
  const { loading, joinSession } = useLobby();
  const { showToast } = useUI();

  const handleScanned = async (code: string) => {
    const result = await joinSession(code);
    if (result.success) {
      showToast('Session rejointe !', 'success');
      navigation.replace('SessionDetail');
    } else {
      showToast(result.error, 'error');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.info} />
        <Text style={styles.loadingText}>Connexion a la session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QRScanner onScanned={handleScanned} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
});
