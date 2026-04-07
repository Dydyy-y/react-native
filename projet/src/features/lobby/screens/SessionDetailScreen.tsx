import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { LobbyStackParamList } from '../../../navigation/NavigationTypes';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabsParamList } from '../../../navigation/NavigationTypes';
import { useLobby } from '../hooks/useLobby';
import { useModeration } from '../hooks/useModeration';
import { useAuth } from '../../auth';
import { useUI } from '../../ui';
import { useGame } from '../../game';
import { usePolling } from '../../../shared/hooks/usePolling';
import { PlayerList } from '../components/PlayerList';
import { QRDisplay } from '../components/QRDisplay';
import { COLORS } from '../../../shared/utils/constants';
import { confirm } from '../../../shared/utils/confirm';

type Props = StackScreenProps<LobbyStackParamList, 'SessionDetail'>;

/** Ecran de detail de la session — polling, liste joueurs, moderation, start */
export const SessionDetailScreen = ({ navigation }: Props) => {
  const { session, loading, refreshSession, leaveSession, dispatch } = useLobby();
  const { kickPlayer, banPlayer, deleteSession, startGame } = useModeration();
  const { state: authState } = useAuth();
  const { showToast } = useUI();
  const { setSessionId, setPlayerNames } = useGame();
  const tabNavigation = useNavigation<BottomTabNavigationProp<AppTabsParamList>>();

  const isCreator = session?.creator.id === authState.user?.id;
  const isWaiting = session?.state === 'waiting';

  // Guard contre le double-tap sur les actions de moderation
  const [moderationLoading, setModerationLoading] = useState(false);

  // Polling toutes les 30s
  // La gestion du 404 (session supprimee) est dans useLobby.refreshSession
  // qui dispatch CLEAR_SESSION — on detecte session=null ci-dessous
  const pollCallback = useCallback(async () => {
    try {
      await refreshSession();
    } catch (error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404 || axiosError.response?.status === 403) {
        dispatch({ type: 'CLEAR_SESSION' });
      }
    }
  }, [refreshSession, dispatch]);

  const { consecutiveErrors: pollErrors } = usePolling(pollCallback, 30000, !!session);

  // Ref pour ne declencher la redirection qu'une seule fois
  const hasRedirectedToGame = useRef(false);
  // Ref indiquant si on a deja visite cette session (evite redirect au premier rendu)
  const hasLoadedSession = useRef(false);

  // Si la session devient null apres avoir ete chargee (404/supprimee), retour lobby
  useEffect(() => {
    if (session) {
      hasLoadedSession.current = true;
    } else if (hasLoadedSession.current && !hasRedirectedToGame.current) {
      showToast('Session supprimee', 'error');
      navigation.replace('LobbyHome');
    }
  }, [session, showToast, navigation]);

  // Redirection si la session passe en "running" (partie demarree)
  useEffect(() => {
    if (session?.state === 'running' && !hasRedirectedToGame.current) {
      hasRedirectedToGame.current = true;
      setSessionId(session.id);
      // Transmettre les noms des joueurs au GameContext pour la legende
      const names: Record<number, string> = {};
      session.players.forEach((p) => { names[p.id] = p.name; });
      setPlayerNames(names);
      // Couper le polling lobby pour eviter le double polling (lobby + game)
      dispatch({ type: 'CLEAR_SESSION' });
      showToast('La partie commence !', 'info');
      tabNavigation.navigate('Game');
    }
  }, [session?.state, session?.id, showToast, setSessionId, setPlayerNames, tabNavigation, session?.players, dispatch]);

  // Si la partie est terminee, retour au lobby
  useEffect(() => {
    if (session?.state === 'finished') {
      showToast('Cette partie est terminee', 'info');
      dispatch({ type: 'CLEAR_SESSION' });
      navigation.replace('LobbyHome');
    }
  }, [session?.state, showToast, dispatch, navigation]);

  // Si le joueur n'est plus dans la liste (kick/ban), retour au lobby
  // On ignore si la session est en running/finished (gere par les effets ci-dessus)
  useEffect(() => {
    if (!session || !authState.user) return;
    if (session.state !== 'waiting') return;
    const stillInSession = session.players.some(
      (p) => p.id === authState.user?.id,
    );
    if (!stillInSession) {
      showToast('Vous avez ete expulse ou banni de la session', 'error');
      dispatch({ type: 'CLEAR_SESSION' });
      navigation.replace('LobbyHome');
    }
  }, [session?.players, authState.user, showToast, navigation, session, dispatch]);

  const handleKick = async (playerId: number) => {
    if (moderationLoading) return;
    setModerationLoading(true);
    try {
      const result = await kickPlayer(playerId);
      if (result.success) {
        showToast('Joueur expulse', 'info');
      } else {
        showToast(result.error, 'error');
      }
    } finally {
      setModerationLoading(false);
    }
  };

  const handleBan = async (playerId: number) => {
    if (moderationLoading) return;
    setModerationLoading(true);
    try {
      const result = await banPlayer(playerId);
      if (result.success) {
        showToast('Joueur banni', 'info');
      } else {
        showToast(result.error, 'error');
      }
    } finally {
      setModerationLoading(false);
    }
  };

  const handleDelete = () => {
    confirm(
      'Supprimer la session',
      'Tous les joueurs seront renvoyes au lobby. Continuer ?',
      async () => {
        const result = await deleteSession();
        if (result.success) {
          showToast('Session supprimee', 'info');
          navigation.replace('LobbyHome');
        } else {
          showToast(result.error, 'error');
        }
      },
    );
  };

  const handleStart = () => {
    confirm(
      'Demarrer la partie',
      'La partie va commencer pour tous les joueurs. Continuer ?',
      async () => {
        const result = await startGame();
        if (!result.success) {
          showToast(result.error, 'error');
        }
      },
    );
  };

  // Quitter la session (non-createur)
  const handleLeave = () => {
    confirm(
      'Quitter le salon',
      'Voulez-vous vraiment quitter cette session ?',
      async () => {
        const result = await leaveSession();
        if (result.success) {
          showToast('Vous avez quitte la session', 'info');
          navigation.replace('LobbyHome');
        } else {
          showToast(result.error ?? 'Erreur', 'error');
        }
      },
    );
  };

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
      {/* Bandeau connexion perdue */}
      {pollErrors >= 2 && (
        <View style={styles.connectionLostBanner}>
          <Ionicons name="cloud-offline-outline" size={18} color={COLORS.white} />
          <Text style={styles.connectionLostText}>
            Connexion perdue — tentative de reconnexion...
          </Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Salon : {session.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Createur : {session.creator.name}
          </Text>
          <Text style={styles.infoText}>
            {session.players.length}/4 joueurs
          </Text>
        </View>
      </View>

      {/* QR Code d'invitation (createur, session en attente, pas pleine) */}
      {isCreator && isWaiting && session.players.length < 4 && (
        <QRDisplay inviteCode={session.invite_code} />
      )}
      {isCreator && isWaiting && session.players.length >= 4 && (
        <View style={styles.sessionFullBanner}>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
          <Text style={styles.sessionFullText}>Session complete (4/4 joueurs)</Text>
        </View>
      )}

      {/* Liste des joueurs avec actions moderation */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="people" size={16} color={COLORS.info} /> Joueurs
        </Text>
        <PlayerList
          players={session.players}
          creatorId={session.creator.id}
          isCreator={isCreator && isWaiting}
          onKick={handleKick}
          onBan={handleBan}
        />
      </View>

      {/* Footer — actions */}
      <View style={styles.footer}>
        {/* Bouton Demarrer (createur, >= 2 joueurs) */}
        {isCreator && isWaiting && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.startButton,
              session.players.length < 2 && styles.buttonDisabled,
            ]}
            onPress={handleStart}
            disabled={loading || session.players.length < 2}
          >
            <Ionicons name="rocket-outline" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>
              {session.players.length < 2
                ? 'En attente de joueurs (min. 2)'
                : 'Commencer la partie'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Bouton Quitter (non-createur, session en attente) */}
        {!isCreator && isWaiting && (
          <TouchableOpacity
            style={[styles.actionButton, styles.leaveButton]}
            onPress={handleLeave}
            disabled={loading}
          >
            <Ionicons name="exit-outline" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Quitter</Text>
          </TouchableOpacity>
        )}

        {/* Bouton Supprimer (createur, session en attente) */}
        {isCreator && isWaiting && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Supprimer la session</Text>
          </TouchableOpacity>
        )}
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
  startButton: {
    backgroundColor: COLORS.success,
  },
  leaveButton: {
    backgroundColor: COLORS.error,
  },
  deleteButton: {
    backgroundColor: '#666',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionLostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b71c1c',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  connectionLostText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  sessionFullBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
    gap: 8,
  },
  sessionFullText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '600',
  },
});
