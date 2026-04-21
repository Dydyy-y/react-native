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

/**
 * Mode de ciblage actif sur la carte.
 * Quand le joueur choisit "Deplacer" ou "Attaquer", la carte passe en mode
 * selection : les cases a portee sont surbrillees et le prochain tap
 * sur une case valide cree l'action correspondante.
 */
export type SelectionMode =
  | { kind: 'move'; ship: Ship }              // Deplacement : tap une case dans la portee de vitesse
  | { kind: 'attack'; ship: Ship }            // Attaque : tap un ennemi dans la portee d'attaque
  | { kind: 'recruit_placement'; shipTypeId: number }  // Achat : tap une case libre
  | null;

interface ActionPanelProps {
  /** Vaisseau actuellement selectionne */
  selectedShip: Ship | null;
  pendingActions: RoundAction[];
  actionsSubmitted: boolean;
  /** Le joueur peut-il agir ce tour (non elimine, actions non soumises, partie en cours) */
  canAct: boolean;
  loading: boolean;
  /** Callback pour definir le mode de selection sur la carte */
  onSetSelectionMode: (mode: SelectionMode) => void;
  onRemoveAction: (index: number) => void;
  onSubmitActions: () => void;
  onDeselectShip: () => void;
}

/**
 * Panneau d'actions en bas de l'ecran de jeu.
 * Affiche selon l'etat : banniere d'attente, hint de selection,
 * boutons move/attack, liste des actions en file, ou bouton de validation.
 */
export const ActionPanel = ({
  selectedShip,
  pendingActions,
  actionsSubmitted,
  canAct,
  loading,
  onSetSelectionMode,
  onRemoveAction,
  onSubmitActions,
  onDeselectShip,
}: ActionPanelProps) => {
  // Verifie si le vaisseau a deja une action ce tour (max 1 move/attack par vaisseau)
  const shipHasAction =
    selectedShip &&
    pendingActions.some(
      (a) => a.type !== 'purchase' && 'ship_id' in a && a.ship_id === selectedShip.id,
    );

  const shipType = selectedShip?.type ?? null;

  return (
    <View style={styles.container}>
      {actionsSubmitted && (
        <View style={styles.waitingBanner}>
          <ActivityIndicator size="small" color={COLORS.info} />
          <Text style={styles.waitingText}>
            En attente des autres joueurs...
          </Text>
        </View>
      )}

      {!selectedShip && canAct && (
        <View style={styles.hintBanner}>
          <Ionicons name="hand-left-outline" size={18} color={COLORS.info} />
          <Text style={styles.hintText}>
            Selectionnez un de vos vaisseaux sur la carte pour agir
          </Text>
        </View>
      )}

      {selectedShip && canAct && (
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

              {(shipType?.damage ?? 0) > 0 && (shipType?.attack_range ?? 0) > 0 && (
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

      {pendingActions.length > 0 && canAct && (
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

      {/* Visible meme sans actions = permet de passer le tour */}
      {canAct && (
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
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hintText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 1,
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
