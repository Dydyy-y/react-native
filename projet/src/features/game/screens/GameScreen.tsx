import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../../auth';
import { useUI } from '../../ui';
import { useLobby } from '../../lobby';
import { usePolling } from '../../../shared/hooks/usePolling';
import { GameMap } from '../components/GameMap';
import { PlayerStatsPanel } from '../components/PlayerStats';
import { COLORS } from '../../../shared/utils/constants';

/** Ecran principal du jeu — carte + stats + polling etat */
export const GameScreen = () => {
  const {
    map,
    gameStatus,
    sessionId,
    loading,
    error,
    loadMap,
    loadState,
  } = useGame();
  const { state: authState } = useAuth();
  const { session } = useLobby();
  const { showToast } = useUI();

  const currentUserId = Number(authState.user?.id);

  // Determiner le sessionId a utiliser (depuis GameContext ou LobbyContext)
  const activeSessionId = sessionId ?? session?.id ?? null;

  // Charger carte + etat au montage quand sessionId est dispo
  useEffect(() => {
    if (activeSessionId && !map) {
      loadMap();
    }
  }, [activeSessionId, map, loadMap]);

  useEffect(() => {
    if (activeSessionId && !gameStatus) {
      loadState();
    }
  }, [activeSessionId, gameStatus, loadState]);

  // Polling de l'etat toutes les 30s
  const pollState = useCallback(async () => {
    try {
      await loadState();
    } catch {
      // Erreur geree dans le hook
    }
  }, [loadState]);

  usePolling(pollState, 30000, !!activeSessionId && !!gameStatus);

  // Detecter fin de partie
  useEffect(() => {
    if (gameStatus?.status === 'finished') {
      showToast('La partie est terminee !', 'info');
    }
  }, [gameStatus?.status, showToast]);

  // Liste unique des player IDs (pour couleurs coherentes)
  const playerIds = useMemo(() => {
    if (!gameStatus) return [];
    const ids = new Set<number>();
    gameStatus.ships.forEach((s) => ids.add(s.player_id));
    return Array.from(ids).sort((a, b) => a - b);
  }, [gameStatus]);

  // Nombre de vaisseaux du joueur actuel
  const myShipCount = useMemo(() => {
    if (!gameStatus) return 0;
    return gameStatus.ships.filter((s) => s.player_id === currentUserId).length;
  }, [gameStatus, currentUserId]);

  // ─── Etats de chargement / erreur ──────────────────────────────────

  if (!activeSessionId) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="game-controller-outline" size={48} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>Aucune partie en cours</Text>
        <Text style={styles.emptySubtext}>
          Demarrez une partie depuis le lobby
        </Text>
      </View>
    );
  }

  if (loading && !map) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.info} />
        <Text style={styles.loadingText}>Chargement de la partie...</Text>
      </View>
    );
  }

  if (error && (!map || !gameStatus)) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            if (!map) loadMap();
            if (!gameStatus) loadState();
          }}
        >
          <Ionicons name="refresh" size={20} color={COLORS.white} />
          <Text style={styles.retryText}>Reessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!map || !gameStatus) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.info} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // ─── Rendu principal ───────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="planet-outline" size={20} color={COLORS.info} />
        <Text style={styles.headerTitle}>
          Tour {gameStatus.round}
        </Text>
        {gameStatus.status === 'finished' && (
          <View style={styles.finishedBadge}>
            <Text style={styles.finishedText}>Terminee</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Carte */}
        <View style={styles.mapContainer}>
          <GameMap map={map} ships={gameStatus.ships} playerIds={playerIds} />
        </View>

        {/* Stats joueur */}
        <PlayerStatsPanel gameStatus={gameStatus} myShipCount={myShipCount} />

        {/* Legende couleurs joueurs */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Joueurs</Text>
          <View style={styles.legendRow}>
            {playerIds.map((pid, idx) => (
              <View key={pid} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor:
                        ['#2196F3', '#f44336', '#4CAF50', '#FF9800'][
                          idx % 4
                        ],
                    },
                  ]}
                />
                <Text style={styles.legendText}>
                  {pid === currentUserId ? 'Vous' : `Joueur ${pid}`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  finishedBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  finishedText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  mapContainer: {
    padding: 8,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  legend: {
    margin: 12,
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: COLORS.text,
    fontSize: 12,
  },
});
