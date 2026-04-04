import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Player } from '../types/lobby.types';
import { COLORS } from '../../../shared/utils/constants';

interface PlayerListProps {
  players: Player[];
  creatorId: number;
}

/** Liste des joueurs dans le salon (FlatList) */
export const PlayerList = ({ players, creatorId }: PlayerListProps) => (
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
        <Text style={styles.playerName}>{item.username}</Text>
        {item.id === creatorId && (
          <Text style={styles.badge}>Createur</Text>
        )}
      </View>
    )}
    contentContainerStyle={styles.list}
    ListEmptyComponent={
      <Text style={styles.emptyText}>Aucun joueur dans le salon</Text>
    }
  />
);

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
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
