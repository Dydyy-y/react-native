import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { LobbyStackParamList } from '../../../navigation/NavigationTypes';
import { useLobby } from '../hooks/useLobby';
import { useAuth } from '../../auth';
import { useUI } from '../../ui';
import { usePolling } from '../../../shared/hooks/usePolling';
import { PlayerList } from '../components/PlayerList';
import { QRDisplay } from '../components/QRDisplay';
import { COLORS } from '../../../shared/utils/constants';

type Props = StackScreenProps<LobbyStackParamList, 'SessionDetail'>;

/** Ecran de detail de la session — polling 30s, liste joueurs, quitter */
export const SessionDetailScreen = ({ navigation }: Props) => {
  const { session, loading, refreshSession, leaveSession } = useLobby();
  const { state: authState } = useAuth();
  const { showToast } = useUI();

  const isCreator = session?.creator.id === Number(authState.user?.id);

  // Polling toutes les 30s pour mettre a jour la session
  const pollCallback = useCallback(async () => {
    try {
      await refreshSession();
    } catch (error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        showToast('Session supprimee', 'error');
        navigation.replace('LobbyHome');
      }
      // Autres erreurs : retry au prochain intervalle
    }
  }, [refreshSession, showToast, navigation]);

  usePolling(pollCallback, 30000, !!session);

  // Redirection si la session passe en "running"
  useEffect(() => {
    if (session?.state === 'running') {
      // Redirection vers le jeu (sera implémenté au Sprint 4)
      showToast('La partie commence !', 'info');
    }
  }, [session?.state, showToast]);

  // Quitter la session (non-créateur)
  const handleLeave = () => {
    Alert.alert(
      'Quitter le salon',
      'Voulez-vous vraiment quitter cette session ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: async () => {
            const result = await leaveSession();
            if (result.success) {
              showToast('Vous avez quitte la session', 'info');
              navigation.replace('LobbyHome');
            } else {
              showToast(result.error ?? 'Erreur', 'error');
            }
          },
        },
      ],
    );
  };

  // Pas de session chargée
  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.info} />
        <Text style={styles.loadingText}>Chargement du salon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Salon : {session.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Createur : {session.creator.username}
          </Text>
          <Text style={styles.infoText}>
            {session.players.length}/4 joueurs
          </Text>
        </View>
      </View>

      {/* QR Code d'invitation (visible pour le créateur) */}
      {isCreator && session.state === 'waiting' && (
        <QRDisplay inviteCode={session.invite_code} />
      )}

      {/* Liste des joueurs */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="people" size={16} color={COLORS.info} /> Joueurs
        </Text>
        <PlayerList
          players={session.players}
          creatorId={session.creator.id}
        />
      </View>

      {/* Actions */}
      <View style={styles.footer}>
        {/* Bouton Quitter (non-créateur, session en attente) */}
        {!isCreator && session.state === 'waiting' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.leaveButton]}
            onPress={handleLeave}
            disabled={loading}
          >
            <Ionicons name="exit-outline" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Quitter</Text>
          </TouchableOpacity>
        )}

        {/* Espace réservé pour les boutons créateur (Sprint 3 : kick, ban, start, delete) */}
      </View>
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  listSection: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 14,
    gap: 8,
  },
  leaveButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
