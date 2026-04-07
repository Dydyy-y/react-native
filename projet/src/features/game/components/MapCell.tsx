import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ship } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';

interface MapCellProps {
  x: number;
  y: number;
  size: number;
  hasResource: boolean;
  ships: Ship[];
  /** True si cette case est selectionnable (dans la portee) */
  inRange: boolean;
  /** True si cette case est le vaisseau selectionne */
  isSelected: boolean;
  onPress: (x: number, y: number) => void;
}

/** Cellule individuelle de la grille. Memo pour perf FlatList. */
export const MapCell = memo(
  ({ x, y, size, hasResource, ships, inRange, isSelected, onPress }: MapCellProps) => {
    const ship = ships.length > 0 ? ships[0] : null;

    // Couleur du vaisseau depuis l'API (owner.color)
    const shipColor = ship?.owner?.color ?? COLORS.white;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(x, y)}
        style={[
          styles.cell,
          { width: size, height: size },
          isSelected && styles.selected,
          inRange && styles.inRange,
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
              name={ship.type?.type === 'fighter' ? 'rocket' : 'construct'}
              size={size * 0.5}
              color={shipColor}
            />
          </View>
        )}

        {/* Indicateur de portee (point lumineux) */}
        {inRange && !ship && !hasResource && (
          <View style={styles.rangeDot} />
        )}
      </TouchableOpacity>
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
  selected: {
    borderWidth: 2,
    borderColor: COLORS.info,
    backgroundColor: 'rgba(33,150,243,0.2)',
  },
  inRange: {
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderColor: 'rgba(76,175,80,0.4)',
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
  rangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(76,175,80,0.5)',
  },
});
