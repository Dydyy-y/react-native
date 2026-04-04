import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../../../shared/utils/constants';

interface QRDisplayProps {
  inviteCode: string;
}

/** Affiche le QR code d'invitation de la session */
export const QRDisplay = ({ inviteCode }: QRDisplayProps) => (
  <View style={styles.container}>
    <View style={styles.qrWrapper}>
      <QRCode
        value={inviteCode}
        size={200}
        backgroundColor={COLORS.white}
        color="#000000"
      />
    </View>
    <Text style={styles.label}>Invitez vos amis a scanner ce QR Code</Text>
    <Text style={styles.code}>{inviteCode}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  code: {
    color: COLORS.text,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    opacity: 0.6,
  },
});
