import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameStackParamList } from '../../../navigation/NavigationTypes';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../../auth';
import { useUI } from '../../ui';
import { usePolling } from '../../../shared/hooks/usePolling';
import { GameMap } from '../components/GameMap';
import { PlayerStatsPanel } from '../components/PlayerStats';
import { ShipInfo } from '../components/ShipInfo';
import { ActionPanel, SelectionMode } from '../components/ActionPanel';
import { ShipShop } from '../components/ShipShop';
import { Ship } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';

/** Calcule les cases a portee (distance de Manhattan) */
const computeRangeCells = (
  cx: number,
  cy: number,
  range: number,
  width: number,
  height: number,
): Set<string> => {
  const cells = new Set<string>();
  for (let dy = -range; dy <= range; dy++) {
    for (let dx = -range; dx <= range; dx++) {
      if (Math.abs(dx) + Math.abs(dy) > range) continue;
      if (dx === 0 && dy === 0) continue;
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        cells.add(`${nx},${ny}`);
      }
    }
  }
  return cells;
};

/** Ecran principal du jeu — carte + stats + actions + polling */
export const GameScreen = () => {
  const {
    map,
    gameStatus,
    shipTypes,
    pendingActions,
    playerNames,
    sessionId,
    loading,
    error,
    loadMap,
    loadState,
    loadShipTypes,
    addAction,
    removeAction,
    clearActions,
    submitActions,
  } = useGame();
  const { state: authState } = useAuth();
  const { showToast } = useUI();

  const currentUserId = authState.user?.id ?? -1;

  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [inspectedShip, setInspectedShip] = useState<Ship | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);
  const [showShop, setShowShop] = useState(false);

  // Ref pour tracker le round courant (detection nouveau tour)
  const prevRoundRef = useRef<number | null>(null);

  // SessionId provient uniquement du GameContext (set par setSessionId au demarrage)
  const activeSessionId = sessionId;

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

  // Charger les types de vaisseaux une seule fois
  useEffect(() => {
    if (activeSessionId && (!shipTypes || shipTypes.length === 0)) {
      loadShipTypes();
    }
  }, [activeSessionId, shipTypes, loadShipTypes]);

  useEffect(() => {
    if (!gameStatus) return;
    if (
      prevRoundRef.current !== null &&
      prevRoundRef.current !== gameStatus.round
    ) {
      // Nouveau tour : avertir si des actions non soumises sont perdues
      if (pendingActions.length > 0) {
        showToast('Nouveau tour — actions non soumises annulees', 'error');
      }
      // Reset de l'UI
      clearActions();
      setSelectedShip(null);
      setSelectionMode(null);
      // Ne pas afficher le toast si le joueur est elimine
      const stillAlive = gameStatus.ships.some(s => s.owner_id === currentUserId);
      if (stillAlive && pendingActions.length === 0) {
        showToast(`Tour ${gameStatus.round} !`, 'info');
      }
    }
    prevRoundRef.current = gameStatus.round;
  }, [gameStatus?.round, clearActions, showToast, gameStatus, pendingActions.length]);

  const pollState = useCallback(async () => {
    try {
      await loadState();
    } catch {
      // Erreur geree dans le hook
    }
  }, [loadState]);

  // Polling : toujours actif tant que la partie est en cours
  // (necessaire pour detecter les changements de tour meme avant soumission)
  const shouldPoll = !!activeSessionId && !!gameStatus && gameStatus.status === 'running';
  const { consecutiveErrors: pollErrors } = usePolling(pollState, 30000, shouldPoll);

  // Detecter fin de partie → nettoyer et naviguer vers GameOverScreen
  const navigation = useNavigation<StackNavigationProp<GameStackParamList>>();
  useEffect(() => {
    if (gameStatus?.status === 'finished' && activeSessionId) {
      clearActions();
      navigation.navigate('GameOver', { sessionId: activeSessionId });
    }
  }, [gameStatus?.status, activeSessionId, navigation, clearActions]);

  const ships = gameStatus?.ships ?? [];

  // Nettoyer selectedShip si le vaisseau a ete detruit
  useEffect(() => {
    if (selectedShip && !ships.find(s => s.id === selectedShip.id)) {
      setSelectedShip(null);
      setSelectionMode(null);
    }
  }, [ships, selectedShip]);

  // Map owner_id → { name, color } — conserve les joueurs elimines dans la legende
  const playerInfoMapRef = useRef(new Map<number, { name: string; color: string }>());
  const playerInfoMap = useMemo(() => {
    const m = playerInfoMapRef.current;
    ships.forEach((s) => {
      if (s.owner && !m.has(s.owner_id)) {
        m.set(s.owner_id, { name: s.owner.name, color: s.owner.color });
      }
    });
    return new Map(m);
  }, [ships]);

  // Nombre de vaisseaux du joueur actuel
  const myShipCount = useMemo(() => {
    return ships.filter((s) => s.owner_id === currentUserId).length;
  }, [ships, currentUserId]);

  // Cases a portee selon le mode de selection actif
  const rangeCells = useMemo(() => {
    if (!selectionMode || !map) return new Set<string>();
    if (selectionMode.kind === 'move') {
      return computeRangeCells(
        selectionMode.ship.x,
        selectionMode.ship.y,
        selectionMode.ship.type?.speed ?? 1,
        map.width,
        map.height,
      );
    }
    if (selectionMode.kind === 'attack') {
      return computeRangeCells(
        selectionMode.ship.x,
        selectionMode.ship.y,
        selectionMode.ship.type?.attack_range ?? 1,
        map.width,
        map.height,
      );
    }
    // recruit_placement : toute la carte (pas de portee)
    return new Set<string>();
  }, [selectionMode, map, shipTypes]);

  // Case du vaisseau selectionne
  const selectedCell = useMemo(() => {
    if (!selectedShip) return null;
    return `${selectedShip.x},${selectedShip.y}`;
  }, [selectedShip]);

  // Le joueur est elimine s'il n'a plus de vaisseaux
  // On ne considere pas l'elimination si aucun vaisseau n'est charge (etat initial)
  const isEliminated = useMemo(() => {
    if (!gameStatus || gameStatus.status !== 'running') return false;
    if (ships.length === 0) return false; // pas encore de donnees chargees
    return ships.filter((s) => s.owner_id === currentUserId).length === 0;
  }, [gameStatus, ships, currentUserId]);

  // Le joueur ne peut pas agir si elimine, actions deja soumises, ou partie finie
  const canAct =
    gameStatus &&
    !gameStatus.round_actions_submitted &&
    gameStatus.status === 'running' &&
    !isEliminated;

  // Index rapide des vaisseaux par position
  const shipsByPos = useMemo(() => {
    const m = new Map<string, Ship[]>();
    ships.forEach((s) => {
      const key = `${s.x},${s.y}`;
      const arr = m.get(key) || [];
      arr.push(s);
      m.set(key, arr);
    });
    return m;
  }, [ships]);

  const handleCellPress = useCallback(
    (x: number, y: number) => {
      if (!gameStatus || !canAct) {
        // En mode lecture seule, inspecter le vaisseau sur la case
        const shipsOnCell = shipsByPos.get(`${x},${y}`) || [];
        if (shipsOnCell.length > 0) {
          setInspectedShip(shipsOnCell[0]);
        }
        return;
      }

      // Si on est en mode selection de cible (move, attack, recruit)
      if (selectionMode) {
        const key = `${x},${y}`;
        const shipsOnTarget = shipsByPos.get(key) || [];

        if (selectionMode.kind === 'move') {
          // Verifier qu'une seule action par vaisseau
          const shipAlreadyHasAction = pendingActions.some(
            (a) => a.type !== 'purchase' && 'ship_id' in a && a.ship_id === selectionMode.ship.id,
          );
          if (shipAlreadyHasAction) {
            showToast('Ce vaisseau a deja une action ce tour', 'error');
            setSelectionMode(null);
            return;
          }
          if (!rangeCells.has(key)) {
            showToast('Case hors de portee', 'error');
            return;
          }
          // Verifier qu'aucune action ne cible deja cette case (move ou purchase)
          const alreadyTargeted = pendingActions.some(
            (a) => (a.type === 'move' || a.type === 'purchase') && a.target_x === x && a.target_y === y,
          );
          if (alreadyTargeted) {
            showToast('Un vaisseau se deplace deja vers cette case', 'error');
            return;
          }
          addAction({
            type: 'move',
            ship_id: selectionMode.ship.id,
            target_x: x,
            target_y: y,
          });
          showToast('Deplacement ajoute', 'success');
        } else if (selectionMode.kind === 'attack') {
          // Verifier qu'une seule action par vaisseau
          const shipAlreadyHasAction = pendingActions.some(
            (a) => a.type !== 'purchase' && 'ship_id' in a && a.ship_id === selectionMode.ship.id,
          );
          if (shipAlreadyHasAction) {
            showToast('Ce vaisseau a deja une action ce tour', 'error');
            setSelectionMode(null);
            return;
          }
          if (!rangeCells.has(key)) {
            showToast('Case hors de portee', 'error');
            return;
          }
          // Verifier qu'il y a un vaisseau ennemi sur la case
          const enemyShip = shipsOnTarget.find(
            (s) => s.owner_id !== currentUserId,
          );
          if (!enemyShip) {
            showToast('Pas de vaisseau ennemi sur cette case', 'error');
            return;
          }
          addAction({
            type: 'attack',
            ship_id: selectionMode.ship.id,
            target_x: x,
            target_y: y,
          });
          showToast('Attaque ajoutee', 'success');
        } else if (selectionMode.kind === 'recruit_placement') {
          // Verifier case libre (pas de vaisseau ni action pendante)
          if (shipsOnTarget.length > 0) {
            showToast('Case occupee par un vaisseau', 'error');
            return;
          }
          const cellAlreadyTargeted = pendingActions.some(
            (a) => (a.type === 'move' || a.type === 'purchase') && a.target_x === x && a.target_y === y,
          );
          if (cellAlreadyTargeted) {
            showToast('Une action cible deja cette case', 'error');
            return;
          }
          addAction({
            type: 'purchase',
            ship_type_id: selectionMode.shipTypeId,
            target_x: x,
            target_y: y,
          });
          showToast('Recrutement ajoute', 'success');
        }

        // Reset mode selection
        setSelectionMode(null);
        setSelectedShip(null);
        return;
      }

      // Pas en mode selection : tap sur une case
      const shipsOnCell = shipsByPos.get(`${x},${y}`) || [];
      if (shipsOnCell.length > 0) {
        const ship = shipsOnCell[0];
        if (ship.owner_id === currentUserId) {
          // Selectionner son propre vaisseau
          setSelectedShip(ship);
        } else {
          // Inspecter un vaisseau ennemi
          setInspectedShip(ship);
        }
      } else {
        // Tap sur case vide : deselectionner
        setSelectedShip(null);
        setSelectionMode(null);
      }
    },
    [
      gameStatus,
      canAct,
      selectionMode,
      rangeCells,
      shipsByPos,
      currentUserId,
      pendingActions,
      addAction,
      showToast,
    ],
  );

  /** Quand l'utilisateur clique "Actions" dans le ShipInfo modal */
  const handleShipAction = useCallback((ship: Ship) => {
    setInspectedShip(null);
    setSelectedShip(ship);
  }, []);

  /** Achat d'un vaisseau : passe en mode placement */
  const handleBuyShip = useCallback(
    (shipTypeId: number) => {
      setShowShop(false);
      setSelectionMode({ kind: 'recruit_placement', shipTypeId });
      showToast('Selectionnez une case pour deployer le vaisseau', 'info');
    },
    [showToast],
  );

  /** Soumission des actions du tour */
  const handleSubmitActions = useCallback(async () => {
    const result = await submitActions();
    if (!result) return;

    if (result.validated) {
      showToast('Actions validees !', 'success');
    } else {
      // Afficher les erreurs du serveur
      const errorMessages = result.errors
        .map((e) => `Action ${e.index + 1}: ${e.message}`)
        .join('\n');
      Alert.alert(
        'Erreur de validation',
        `Corrigez les actions et renvoyez :\n\n${errorMessages}`,
      );
    }
  }, [submitActions, showToast]);

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

  // Minerai reel = minerai API - cout des achats en attente
  const rawOre = gameStatus.resources?.ore ?? 0;
  const pendingPurchaseCost = pendingActions.reduce((sum, a) => {
    if (a.type === 'purchase') {
      const st = shipTypes.find((t) => t.id === a.ship_type_id);
      return sum + (st?.cost ?? 0);
    }
    return sum;
  }, 0);
  const ore = Math.max(0, rawOre - pendingPurchaseCost);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        {/* Bouton boutique */}
        {canAct && (
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => setShowShop(true)}
          >
            <Ionicons name="cart" size={18} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>

      {/* Bandeau connexion perdue */}
      {pollErrors >= 2 && (
        <View style={styles.connectionLostBanner}>
          <Ionicons name="cloud-offline-outline" size={18} color={COLORS.white} />
          <Text style={styles.connectionLostText}>
            Connexion perdue — tentative de reconnexion...
          </Text>
        </View>
      )}

      {/* Bandeau elimination */}
      {isEliminated && (
        <View style={styles.eliminatedBanner}>
          <Ionicons name="skull-outline" size={20} color={COLORS.white} />
          <Text style={styles.eliminatedText}>
            Vous avez ete elimine ! Vous pouvez observer la partie.
          </Text>
        </View>
      )}

      {/* Instruction mode selection */}
      {selectionMode && (
        <View style={styles.instructionBanner}>
          <Text style={styles.instructionText}>
            {selectionMode.kind === 'move' && 'Selectionnez la case de destination'}
            {selectionMode.kind === 'attack' && 'Selectionnez un vaisseau ennemi a attaquer'}
            {selectionMode.kind === 'recruit_placement' && 'Selectionnez une case libre pour le deploiement'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectionMode(null);
              setSelectedShip(null);
            }}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollContent}>
        {/* Carte */}
        <View style={styles.mapContainer}>
          <GameMap
            map={map}
            shipsByPos={shipsByPos}
            rangeCells={rangeCells}
            selectedCell={selectedCell}
            onCellPress={handleCellPress}
          />
        </View>

        {/* Stats joueur */}
        <PlayerStatsPanel gameStatus={gameStatus} myShipCount={myShipCount} />

        {/* Panneau d'actions */}
        <ActionPanel
          selectedShip={selectedShip}
          pendingActions={pendingActions}
          actionsSubmitted={gameStatus.round_actions_submitted}
          canAct={!!canAct}
          loading={loading}
          onSetSelectionMode={setSelectionMode}
          onRemoveAction={removeAction}
          onSubmitActions={handleSubmitActions}
          onDeselectShip={() => {
            setSelectedShip(null);
            setSelectionMode(null);
          }}
        />

        {/* Legende couleurs joueurs */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Joueurs</Text>
          <View style={styles.legendRow}>
            {Array.from(playerInfoMap.entries()).map(([pid, info]) => (
              <View key={`player-${pid}`} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: info.color },
                  ]}
                />
                <Text style={styles.legendText}>
                  {pid === currentUserId ? 'Vous' : info.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <ShipInfo
        ship={inspectedShip}
        shipTypes={shipTypes}
        currentUserId={currentUserId}
        visible={!!inspectedShip}
        canAct={!!canAct}
        onClose={() => setInspectedShip(null)}
        onAction={handleShipAction}
      />

      <ShipShop
        visible={showShop}
        shipTypes={shipTypes}
        ore={ore}
        onBuy={handleBuyShip}
        onClose={() => setShowShop(false)}
      />
    </SafeAreaView>
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
  shopButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 8,
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.info,
  },
  instructionText: {
    color: COLORS.info,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
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
  eliminatedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b71c1c',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  eliminatedText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  connectionLostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b71c1c',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  connectionLostText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
