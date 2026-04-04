import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ship } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';

/** Couleurs par joueur (max 4) */
const PLAYER_COLORS = ['#2196F3', '#f44336', '#4CAF50', '#FF9800'];

interface MapCellProps {
  size: number;
  hasResource: boolean;
  ships: Ship[];
  /** Liste ordonnee des player IDs pour attribuer les couleurs */
  playerIds: number[];
}

/** Cellule individuelle de la grille. Memo pour perf FlatList. */
export const MapCell = memo(
  ({ size, hasResource, ships, playerIds }: MapCellProps) => {
    const ship = ships.length > 0 ? ships[0] : null;

    // Couleur du vaisseau selon le joueur
    const playerColorIndex = ship
      ? playerIds.indexOf(ship.player_id)
      : -1;
    const shipColor =
      playerColorIndex >= 0
        ? PLAYER_COLORS[playerColorIndex % PLAYER_COLORS.length]
        : COLORS.white;

    return (
      <View
        style={[
          styles.cell,
          { width: size, height: size },
        ]}
      >
        {/* Ressource : fond dore */}
        {hasResource && (
          <View style={[styles.resource, { width: size - 2, height: size - 2 }]}>
            <Ionicons name="diamond" size={size * 0.4} color="#FFD700" />
          </View>
        )}

        {/* Vaisseau : affiche au-dessus de la ressource */}
        {ship && (
          <View style={styles.shipOverlay}>
            <Ionicons
              name={
                ship.ship_type_id === 1 ? 'rocket' : 'construct'
              }
              size={size * 0.5}
              color={shipColor}
            />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  cell: {
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resource: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderRadius: 2,
  },
  shipOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
