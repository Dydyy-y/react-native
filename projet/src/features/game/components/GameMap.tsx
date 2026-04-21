import React, { useMemo } from 'react';
import { View, FlatList, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { GameMap as GameMapType, Ship, ResourceNode } from '../types/game.types';
import { MapCell } from './MapCell';
import { COLORS } from '../../../shared/utils/constants';

// En-dessous de 36px les icones de vaisseaux deviennent illisibles
const MIN_CELL_SIZE = 36;

interface GameMapProps {
  map: GameMapType;
  /** Index pre-calcule des vaisseaux par position "x,y" (evite le double calcul) */
  shipsByPos: Map<string, Ship[]>;
  /** Ensemble de "x,y" representant les cases a portee */
  rangeCells: Set<string>;
  /** "x,y" du vaisseau actuellement selectionne */
  selectedCell: string | null;
  onCellPress: (x: number, y: number) => void;
}

/** Donnees pre-calculees pour chaque cellule */
interface CellData {
  key: string;
  x: number;
  y: number;
  hasResource: boolean;
  ships: Ship[];
}

/**
 * Grille du jeu rendue avec FlatList. Calcule la taille des cellules
 * pour s'adapter a l'ecran, avec scroll horizontal si la carte est trop large.
 * Les donnees (ressources, vaisseaux) sont pre-indexees en amont pour perf.
 */
export const GameMap = ({
  map,
  shipsByPos,
  rangeCells,
  selectedCell,
  onCellPress,
}: GameMapProps) => {
  const screenWidth = Dimensions.get('window').width - 16; // padding du mapContainer
  const naturalSize = Math.floor(screenWidth / map.width);
  const cellSize = Math.max(naturalSize, MIN_CELL_SIZE);
  const gridWidth = cellSize * map.width;

  // Index rapide des ressources : "x,y" -> true
  const resourceSet = useMemo(() => {
    const set = new Set<string>();
    map.resource_nodes.forEach((r: ResourceNode) => set.add(`${r.x},${r.y}`));
    return set;
  }, [map.resource_nodes]);

  // Reference stable [] pour eviter que React.memo re-rende les cellules vides
  // (une nouvelle ref [] a chaque render casserait la comparaison shallow)
  const emptyShips: Ship[] = useMemo(() => [], []);

  // Pre-calcul de toutes les cellules de la grille.
  // Iteration y puis x car FlatList affiche en lignes (row-major).
  const cells = useMemo(() => {
    const result: CellData[] = [];
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const key = `${x},${y}`;
        result.push({
          key,
          x,
          y,
          hasResource: resourceSet.has(key),
          ships: shipsByPos.get(key) || emptyShips,
        });
      }
    }
    return result;
  }, [map.width, map.height, resourceSet, shipsByPos, emptyShips]);

  const needsScroll = gridWidth > screenWidth;

  return (
    <ScrollView horizontal={needsScroll} style={styles.scrollContainer}>
      <View style={[styles.container, { width: gridWidth }]}>
        <FlatList
          data={cells}
          keyExtractor={(item) => item.key}
          numColumns={map.width}
          renderItem={({ item }) => (
            <MapCell
              x={item.x}
              y={item.y}
              size={cellSize}
              hasResource={item.hasResource}
              ships={item.ships}
              inRange={rangeCells.has(item.key)}
              isSelected={selectedCell === item.key}
              onPress={onCellPress}
            />
          )}
          scrollEnabled={false}
          getItemLayout={(_data, index) => ({
            length: cellSize,
            offset: cellSize * Math.floor(index / map.width),
            index,
          })}
          key={`grid-${map.width}`}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  container: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
});
