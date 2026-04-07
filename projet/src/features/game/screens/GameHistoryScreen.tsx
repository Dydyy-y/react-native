import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../auth';
import { useGameHistory, useGameDetail } from '../hooks/useGameHistory';
import { GameHistoryEntry } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';

/** Ecran historique des parties jouees */
export const GameHistoryScreen = () => {
  const { state: authState } = useAuth();
  const currentUserId = authState.user?.id ?? -1;

  const { entries, loading, error, loadingMore, loadMore, retry } = useGameHistory();
  const { selectedId, stats: detailStats, loading: detailLoading, select: handleSelectEntry } = useGameDetail();

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const renderEntry = ({ item }: { item: GameHistoryEntry }) => {
    const isSelected = selectedId === item.id;
    const isWinner = item.winner?.player_id === currentUserId;
    const isFinished = item.status === 'finished';

    return (
      <TouchableOpacity
        style={[styles.entryCard, isSelected && styles.entryCardSelected]}
        onPress={() => handleSelectEntry(item)}
        activeOpacity={0.7}
      >
        <View style={styles.entryHeader}>
          <View style={styles.entryTitleRow}>
            <Ionicons
              name={isFinished ? 'checkmark-circle' : 'time-outline'}
              size={18}
              color={isFinished ? COLORS.success : COLORS.textSecondary}
            />
            <Text style={styles.entryName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <Text style={styles.entryDate}>{formatDate(item.created_at)}</Text>
        </View>

        <View style={styles.entryFooter}>
          {isFinished && item.winner && (
            <View style={[styles.resultBadge, isWinner ? styles.winBadge : styles.loseBadge]}>
              <Text style={styles.resultText}>
                {isWinner ? 'Victoire' : `Gagnant: ${item.winner.name}`}
              </Text>
            </View>
          )}
          {!isFinished && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          )}
          <Ionicons
            name={isSelected ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={COLORS.textSecondary}
          />
        </View>

        {/* Detail inline */}
        {isSelected && (
          <View style={styles.detailContainer}>
            {detailLoading && (
              <ActivityIndicator size="small" color={COLORS.info} />
            )}
            {!detailLoading && detailStats && (
              <>
                <Text style={styles.detailTitle}>
                  {detailStats.rounds} tour{detailStats.rounds > 1 ? 's' : ''}
                </Text>
                {detailStats.players.map((p, idx) => (
                  <View key={p.player_id} style={styles.detailPlayer}>
                    <Text style={styles.detailRank}>#{idx + 1}</Text>
                    <Text
                      style={[
                        styles.detailName,
                        p.player_id === currentUserId && styles.detailNameMe,
                      ]}
                    >
                      {p.name}
                      {p.player_id === currentUserId ? ' (vous)' : ''}
                    </Text>
                    <Text style={styles.detailStat}>
                      {p.ships_destroyed} dest. / {p.resources_collected} coll.
                    </Text>
                  </View>
                ))}
              </>
            )}
            {!detailLoading && !detailStats && (
              <Text style={styles.detailEmpty}>Stats non disponibles</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.info} />
        <Text style={styles.loadingText}>Chargement de l'historique...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={retry}
        >
          <Text style={styles.retryText}>Reessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="game-controller-outline" size={48} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>Aucune partie jouee</Text>
        <Text style={styles.emptySubtext}>
          Vos parties apparaitront ici une fois terminees
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderEntry}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={COLORS.info}
              style={styles.footer}
            />
          ) : null
        }
      />
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
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: COLORS.info,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  entryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  entryCardSelected: {
    borderColor: COLORS.info,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  entryName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  entryDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 8,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  winBadge: {
    backgroundColor: '#1a3a1a',
  },
  loseBadge: {
    backgroundColor: COLORS.accent,
  },
  resultText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  detailContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  detailTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  detailPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailRank: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: 'bold',
    width: 28,
  },
  detailName: {
    color: COLORS.text,
    fontSize: 13,
    flex: 1,
  },
  detailNameMe: {
    color: COLORS.info,
    fontWeight: '600',
  },
  detailStat: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  detailEmpty: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
  footer: {
    paddingVertical: 16,
  },
});
