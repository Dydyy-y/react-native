import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameStatus } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';

interface PlayerStatsProps {
  gameStatus: GameStatus;
  myShipCount: number;
}

/** Panneau d'affichage des stats du joueur */
export const PlayerStatsPanel = ({ gameStatus, myShipCount }: PlayerStatsProps) => {
  const ore = gameStatus.resources?.ore ?? 0;
  const shipsDestroyed = gameStatus.stats?.ships_destroyed ?? 0;
  const resourcesCollected = gameStatus.stats?.resources_collected ?? 0;

  return (
    <View style={styles.container}>
      {/* Ligne 1 : tour + minerai */}
      <View style={styles.row}>
        <View style={styles.stat}>
          <Ionicons name="sync-outline" size={16} color={COLORS.info} />
          <Text style={styles.label}>Tour</Text>
          <Text style={styles.value}>{gameStatus.round}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="diamond" size={16} color="#FFD700" />
          <Text style={styles.label}>Minerai</Text>
          <Text style={styles.value}>{ore}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="rocket" size={16} color={COLORS.info} />
          <Text style={styles.label}>Vaisseaux</Text>
          <Text style={styles.value}>{myShipCount}</Text>
        </View>
      </View>

      {/* Ligne 2 : stats cumulees + status actions */}
      <View style={styles.row}>
        <View style={styles.stat}>
          <Ionicons name="skull-outline" size={16} color={COLORS.error} />
          <Text style={styles.label}>Detruits</Text>
          <Text style={styles.value}>{shipsDestroyed}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="cube-outline" size={16} color="#FFD700" />
          <Text style={styles.label}>Recoltes</Text>
          <Text style={styles.value}>{resourcesCollected}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name={gameStatus.round_actions_submitted ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={gameStatus.round_actions_submitted ? COLORS.success : COLORS.error}
          />
          <Text style={styles.label}>Actions</Text>
          <Text
            style={[
              styles.value,
              { color: gameStatus.round_actions_submitted ? COLORS.success : COLORS.error },
            ]}
          >
            {gameStatus.round_actions_submitted ? 'Validees' : 'Non validees'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    gap: 2,
    minWidth: 70,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  value: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
