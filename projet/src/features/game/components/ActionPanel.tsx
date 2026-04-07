import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ship, RoundAction } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';

/** Mode de selection sur la carte apres avoir choisi une action */
export type SelectionMode =
  | { kind: 'move'; ship: Ship }
  | { kind: 'attack'; ship: Ship }
  | { kind: 'recruit_placement'; shipTypeId: number }
  | null;

interface ActionPanelProps {
  /** Vaisseau actuellement selectionne */
  selectedShip: Ship | null;
  pendingActions: RoundAction[];
  actionsSubmitted: boolean;
  loading: boolean;
  /** Callback pour definir le mode de selection sur la carte */
  onSetSelectionMode: (mode: SelectionMode) => void;
  onRemoveAction: (index: number) => void;
  onSubmitActions: () => void;
  onDeselectShip: () => void;
}

/** Panneau d'actions : choix move/attack pour un vaisseau, liste des actions, bouton valider */
export const ActionPanel = ({
  selectedShip,
  pendingActions,
  actionsSubmitted,
  loading,
  onSetSelectionMode,
  onRemoveAction,
  onSubmitActions,
  onDeselectShip,
}: ActionPanelProps) => {
  // Verifier si le vaisseau selectionne a deja une action ce tour
  const shipHasAction =
    selectedShip &&
    pendingActions.some(
      (a) => a.type !== 'purchase' && 'ship_id' in a && a.ship_id === selectedShip.id,
    );

  const shipType = selectedShip?.type ?? null;

  return (
    <View style={styles.container}>
      {/* Attente entre tours */}
      {actionsSubmitted && (
        <View style={styles.waitingBanner}>
          <ActivityIndicator size="small" color={COLORS.info} />
          <Text style={styles.waitingText}>
            En attente des autres joueurs...
          </Text>
        </View>
      )}

      {/* Actions pour le vaisseau selectionne */}
      {selectedShip && !actionsSubmitted && (
        <View style={styles.shipActions}>
          <View style={styles.shipHeader}>
            <Ionicons
              name={shipType?.type === 'fighter' ? 'rocket' : 'construct'}
              size={16}
              color={COLORS.info}
            />
            <Text style={styles.shipName}>
              {shipType?.name ?? 'Vaisseau'} #{selectedShip.id}
            </Text>
            <TouchableOpacity onPress={onDeselectShip}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {shipHasAction ? (
            <Text style={styles.alreadyActed}>
              Ce vaisseau a deja une action ce tour
            </Text>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.moveButton}
                onPress={() =>
                  onSetSelectionMode({ kind: 'move', ship: selectedShip })
                }
              >
                <Ionicons name="move" size={18} color={COLORS.white} />
                <Text style={styles.buttonText}>Deplacer</Text>
                <Text style={styles.rangeText}>({shipType?.speed ?? '?'} cases)</Text>
              </TouchableOpacity>

              {/* Attaque uniquement pour les fighters */}
              {shipType?.type === 'fighter' && (
                <TouchableOpacity
                  style={styles.attackButton}
                  onPress={() =>
                    onSetSelectionMode({ kind: 'attack', ship: selectedShip })
                  }
                >
                  <Ionicons name="flash" size={18} color={COLORS.white} />
                  <Text style={styles.buttonText}>Attaquer</Text>
                  <Text style={styles.rangeText}>({shipType?.attack_range ?? '?'} cases)</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      {/* Liste des actions en attente */}
      {pendingActions.length > 0 && !actionsSubmitted && (
        <View style={styles.pendingSection}>
          <Text style={styles.pendingTitle}>
            Actions en attente ({pendingActions.length})
          </Text>
          <FlatList
            data={pendingActions}
            keyExtractor={(_, i) => `action-${i}`}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={styles.pendingItem}>
                <Ionicons
                  name={
                    item.type === 'move'
                      ? 'move'
                      : item.type === 'attack'
                        ? 'flash'
                        : 'cart' /* purchase */
                  }
                  size={14}
                  color={
                    item.type === 'move'
                      ? COLORS.info
                      : item.type === 'attack'
                        ? COLORS.error
                        : COLORS.success
                  }
                />
                <Text style={styles.pendingText}>
                  {item.type === 'move' && `Deplacer #${'ship_id' in item ? item.ship_id : '?'} → (${item.target_x}, ${item.target_y})`}
                  {item.type === 'attack' && `Attaquer #${'ship_id' in item ? item.ship_id : '?'} → (${item.target_x}, ${item.target_y})`}
                  {item.type === 'purchase' && `Achat → (${item.target_x}, ${item.target_y})`}
                </Text>
                <TouchableOpacity onPress={() => onRemoveAction(index)}>
                  <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Bouton valider (visible meme sans actions = passer le tour) */}
      {!actionsSubmitted && (
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitDisabled]}
          onPress={onSubmitActions}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={styles.submitText}>
                {pendingActions.length > 0 ? 'Valider mes actions' : 'Passer le tour'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 8,
    gap: 8,
  },
  waitingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.info,
  },
  waitingText: {
    color: COLORS.info,
    fontSize: 14,
    fontWeight: '600',
  },
  shipActions: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  shipName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  alreadyActed: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  moveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.info,
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  attackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    borderRadius: 8,
    padding: 10,
    gap: 6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  rangeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  pendingSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pendingTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  pendingText: {
    color: COLORS.text,
    fontSize: 12,
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    borderRadius: 8,
    padding: 14,
    gap: 8,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
