import React, { useMemo } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { GameMap as GameMapType, Ship, ResourceNode } from '../types/game.types';
import { MapCell } from './MapCell';
import { COLORS } from '../../../shared/utils/constants';

interface GameMapProps {
  map: GameMapType;
  ships: Ship[];
  playerIds: number[];
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

/** Grille FlatList du jeu — fond uni, icones uniquement sur cases occupees */
export const GameMap = ({
  map,
  ships,
  playerIds,
  rangeCells,
  selectedCell,
  onCellPress,
}: GameMapProps) => {
  const screenWidth = Dimensions.get('window').width;
  const cellSize = Math.floor(screenWidth / map.width);

  // Index rapide des ressources : "x,y" -> true
  const resourceSet = useMemo(() => {
    const set = new Set<string>();
    map.resource_nodes.forEach((r: ResourceNode) => set.add(`${r.x},${r.y}`));
    return set;
  }, [map.resource_nodes]);

  // Index rapide des vaisseaux : "x,y" -> Ship[]
  const shipMap = useMemo(() => {
    const m = new Map<string, Ship[]>();
    ships.forEach((s) => {
      const key = `${s.x},${s.y}`;
      const arr = m.get(key) || [];
      arr.push(s);
      m.set(key, arr);
    });
    return m;
  }, [ships]);

  // Generer toutes les cellules (y puis x, car FlatList est row-major)
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
          ships: shipMap.get(key) || [],
        });
      }
    }
    return result;
  }, [map.width, map.height, resourceSet, shipMap]);

  return (
    <View style={styles.container}>
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
            playerIds={playerIds}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
});
