import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ship, ShipType } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';

interface ShipInfoProps {
  ship: Ship | null;
  shipTypes: ShipType[];
  currentUserId: number;
  visible: boolean;
  onClose: () => void;
  /** Callback quand le joueur veut agir sur son propre vaisseau */
  onAction: (ship: Ship) => void;
}

/** Modal affichant les infos detaillees d'un vaisseau */
export const ShipInfo = ({
  ship,
  shipTypes,
  currentUserId,
  visible,
  onClose,
  onAction,
}: ShipInfoProps) => {
  if (!ship) return null;

  const shipType = shipTypes.find((t) => t.id === ship.ship_type_id);
  const isOwn = ship.player_id === currentUserId;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons
              name={shipType?.name === 'fighter' ? 'rocket' : 'construct'}
              size={24}
              color={isOwn ? COLORS.info : COLORS.error}
            />
            <Text style={styles.title}>
              {shipType?.name === 'fighter' ? 'Chasseur' : 'Mineur'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Proprietaire */}
          <View style={styles.ownerRow}>
            <Ionicons
              name="person"
              size={14}
              color={isOwn ? COLORS.success : COLORS.error}
            />
            <Text
              style={[
                styles.ownerText,
                { color: isOwn ? COLORS.success : COLORS.error },
              ]}
            >
              {isOwn ? 'Votre vaisseau' : `Joueur ${ship.player_id}`}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <StatItem icon="heart" label="PV" value={`${ship.health}/${shipType?.base_health ?? '?'}`} color={COLORS.error} />
            <StatItem icon="flash" label="Attaque" value={`${shipType?.damage ?? '?'}`} color="#FF9800" />
            <StatItem icon="locate" label="Portee atk" value={`${shipType?.attack_range ?? '?'}`} color="#FF9800" />
            <StatItem icon="speedometer" label="Vitesse" value={`${shipType?.speed ?? '?'}`} color={COLORS.info} />
            {shipType?.name === 'miner' && (
              <StatItem icon="diamond" label="Recolte" value={`${shipType.gathering_rate}`} color="#FFD700" />
            )}
          </View>

          {/* Position */}
          <Text style={styles.positionText}>
            Position : ({ship.x}, {ship.y})
          </Text>

          {/* Bouton d'action pour ses propres vaisseaux */}
          {isOwn && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onAction(ship)}
            >
              <Ionicons name="game-controller" size={18} color={COLORS.white} />
              <Text style={styles.actionText}>Actions</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/** Petit composant stat reutilisable */
const StatItem = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) => (
  <View style={styles.statItem}>
    <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={16} color={color} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    width: '85%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  ownerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
    gap: 2,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  positionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.info,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
