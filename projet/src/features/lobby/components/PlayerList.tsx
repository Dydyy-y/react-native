import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Player } from '../types/lobby.types';
import { COLORS } from '../../../shared/utils/constants';

interface PlayerListProps {
  players: Player[];
  creatorId: number;
  /** Si true, affiche les boutons kick/ban (createur uniquement) */
  isCreator?: boolean;
  onKick?: (playerId: number) => void;
  onBan?: (playerId: number) => void;
}

/** Liste des joueurs dans le salon (FlatList) avec actions de moderation */
export const PlayerList = ({ players, creatorId, isCreator, onKick, onBan }: PlayerListProps) => {
  const confirmKick = (player: Player) => {
    Alert.alert(
      'Expulser le joueur',
      `Voulez-vous expulser ${player.name} ? Il pourra rejoindre a nouveau.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Expulser', style: 'destructive', onPress: () => onKick?.(player.id) },
      ],
    );
  };

  const confirmBan = (player: Player) => {
    Alert.alert(
      'Bannir le joueur',
      `Voulez-vous bannir ${player.name} ? Il ne pourra plus rejoindre cette session.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Bannir', style: 'destructive', onPress: () => onBan?.(player.id) },
      ],
    );
  };

  return (
    <FlatList
      data={players}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.playerRow}>
          <Ionicons
            name={item.id === creatorId ? 'star' : 'person-outline'}
            size={20}
            color={item.id === creatorId ? COLORS.info : COLORS.textSecondary}
          />
          <Text style={styles.playerName}>{item.name}</Text>
          {item.id === creatorId && (
            <Text style={styles.badge}>Createur</Text>
          )}

          {/* Actions de moderation (createur uniquement, pas sur soi-meme) */}
          {isCreator && item.id !== creatorId && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.kickButton}
                onPress={() => confirmKick(item)}
              >
                <Ionicons name="remove-circle-outline" size={18} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.banButton}
                onPress={() => confirmBan(item)}
              >
                <Ionicons name="ban-outline" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Aucun joueur dans le salon</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  playerName: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    color: COLORS.info,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8,
  },
  kickButton: {
    backgroundColor: '#FF9800',
    borderRadius: 6,
    padding: 6,
  },
  banButton: {
    backgroundColor: COLORS.error,
    borderRadius: 6,
    padding: 6,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
