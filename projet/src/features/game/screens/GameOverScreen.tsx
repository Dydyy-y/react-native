import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppTabsParamList } from '../../../navigation/NavigationTypes';
import { getGameStats } from '../services/gameService';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../../auth';
import { useLobbyContext } from '../../lobby';
import { GameStats, GameStatsPlayer } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';
import { getErrorMessage } from '../../../shared/utils/errorHandler';

type GameOverRouteParams = {
  GameOver: { sessionId: number };
};

/** Ecran de fin de partie — classement, stats, gagnant */
export const GameOverScreen = () => {
  const route = useRoute<RouteProp<GameOverRouteParams, 'GameOver'>>();
  const navigation = useNavigation<BottomTabNavigationProp<AppTabsParamList>>();
  const { state: authState } = useAuth();
  const { clearGame } = useGame();
  const { dispatch: lobbyDispatch } = useLobbyContext();
  const currentUserId = authState.user?.id ?? -1;

  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = route.params?.sessionId;

  useEffect(() => {
    if (!sessionId) return;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getGameStats(sessionId);
        setStats(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [sessionId]);

  const handleReturnToLobby = () => {
    clearGame();
    lobbyDispatch({ type: 'CLEAR_SESSION' });
    navigation.navigate('Lobby');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.info} />
        <Text style={styles.loadingText}>Chargement des resultats...</Text>
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error ?? 'Impossible de charger les resultats'}</Text>
        <TouchableOpacity style={styles.lobbyButton} onPress={handleReturnToLobby}>
          <Text style={styles.lobbyButtonText}>Retour au lobby</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isWinner = stats.winner?.player_id === currentUserId;

  const renderPlayer = ({ item, index }: { item: GameStatsPlayer; index: number }) => {
    const isMe = item.player_id === currentUserId;
    const isPlayerWinner = item.player_id === stats.winner?.player_id;
    return (
      <View style={[styles.playerRow, isMe && styles.playerRowMe]}>
        <Text style={styles.rank}>#{index + 1}</Text>
        <View style={styles.playerInfo}>
          <View style={styles.playerNameRow}>
            <Text style={[styles.playerName, isMe && styles.playerNameMe]}>
              {item.name}
            </Text>
            {isPlayerWinner && (
              <Ionicons name="trophy" size={16} color="#FFD700" />
            )}
            {isMe && <Text style={styles.youBadge}>Vous</Text>}
          </View>
          <View style={styles.playerStatsRow}>
            <Text style={styles.playerStat}>
              <Ionicons name="flame-outline" size={12} color={COLORS.error} /> {item.ships_destroyed} detruits
            </Text>
            <Text style={styles.playerStat}>
              <Ionicons name="diamond-outline" size={12} color={COLORS.info} /> {item.resources_collected} collectes
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* En-tete victoire/defaite */}
      <View style={[styles.resultHeader, isWinner ? styles.winHeader : styles.loseHeader]}>
        <Ionicons
          name={isWinner ? 'trophy' : 'sad-outline'}
          size={48}
          color={isWinner ? '#FFD700' : COLORS.textSecondary}
        />
        <Text style={styles.resultTitle}>
          {isWinner ? 'Victoire !' : 'Partie terminee'}
        </Text>
        {stats.winner && (
          <Text style={styles.winnerName}>
            {isWinner ? 'Vous avez gagne !' : `Gagnant : ${stats.winner.name}`}
          </Text>
        )}
        <Text style={styles.roundsText}>
          {stats.rounds} tour{stats.rounds > 1 ? 's' : ''} joue{stats.rounds > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Classement */}
      <Text style={styles.sectionTitle}>Classement</Text>
      <FlatList
        data={stats.players}
        keyExtractor={(item) => String(item.player_id)}
        renderItem={renderPlayer}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      {/* Bouton retour */}
      <TouchableOpacity style={styles.lobbyButton} onPress={handleReturnToLobby}>
        <Ionicons name="arrow-back" size={18} color={COLORS.white} />
        <Text style={styles.lobbyButtonText}>Retour au lobby</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 8,
  },
  winHeader: {
    backgroundColor: '#1a3a1a',
  },
  loseHeader: {
    backgroundColor: COLORS.surface,
  },
  resultTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  winnerName: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  roundsText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  playerRowMe: {
    borderColor: COLORS.info,
    borderWidth: 2,
  },
  rank: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
    width: 36,
    textAlign: 'center',
  },
  playerInfo: {
    flex: 1,
    gap: 4,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  playerNameMe: {
    color: COLORS.info,
  },
  youBadge: {
    color: COLORS.info,
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  playerStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  playerStat: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  lobbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.info,
    margin: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
  lobbyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
