import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { LobbyStackParamList } from '../../../navigation/NavigationTypes';
import { COLORS } from '../../../shared/utils/constants';

type Props = StackScreenProps<LobbyStackParamList, 'LobbyHome'>;

/** Ecran d'accueil du lobby — boutons "Nouvelle session" et "Rejoindre" */
export const LobbyHomeScreen = ({ navigation }: Props) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Ionicons name="planet-outline" size={64} color={COLORS.info} />
      <Text style={styles.title}>Space Conquest</Text>
      <Text style={styles.subtitle}>Creez ou rejoignez une partie</Text>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CreateSession')}
      >
        <Ionicons name="add-circle-outline" size={36} color={COLORS.info} />
        <Text style={styles.cardTitle}>Nouvelle session</Text>
        <Text style={styles.cardDesc}>Creez une partie et invitez vos amis</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('JoinSession')}
      >
        <Ionicons name="qr-code-outline" size={36} color={COLORS.info} />
        <Text style={styles.cardTitle}>Rejoindre</Text>
        <Text style={styles.cardDesc}>Scannez un QR code pour rejoindre</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  actions: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  cardDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});
