import React, { useMemo } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { GameMap as GameMapType, Ship, ShipType, ResourceNode } from '../types/game.types';
import { MapCell } from './MapCell';
import { COLORS } from '../../../shared/utils/constants';

interface GameMapProps {
  map: GameMapType;
  /** Index pre-calcule des vaisseaux par position "x,y" (evite le double calcul) */
  shipsByPos: Map<string, Ship[]>;
  shipTypes: ShipType[];
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
  shipsByPos,
  shipTypes,
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

  // Map ship_type_id → nom (pour resolution d'icone sans hardcoder les IDs)
  const shipTypeNames = useMemo(() => {
    const m = new Map<number, string>();
    shipTypes.forEach((t) => m.set(t.id, t.name));
    return m;
  }, [shipTypes]);

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
          ships: shipsByPos.get(key) || [],
        });
      }
    }
    return result;
  }, [map.width, map.height, resourceSet, shipsByPos]);

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
            shipTypeNames={shipTypeNames}
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
