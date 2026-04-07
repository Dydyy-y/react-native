import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShipType } from '../types/game.types';
import { COLORS } from '../../../shared/utils/constants';

interface ShipShopProps {
  visible: boolean;
  shipTypes: ShipType[];
  ore: number;
  onBuy: (shipTypeId: number) => void;
  onClose: () => void;
}

/** Modal boutique : liste les types de vaisseaux et permet l'achat */
export const ShipShop = ({
  visible,
  shipTypes,
  ore,
  onBuy,
  onClose,
}: ShipShopProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
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
            <Ionicons name="cart" size={22} color={COLORS.info} />
            <Text style={styles.title}>Chantier spatial</Text>
            <View style={styles.oreDisplay}>
              <Ionicons name="diamond" size={14} color="#FFD700" />
              <Text style={styles.oreText}>{ore}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Liste des types */}
          <FlatList
            data={shipTypes}
            keyExtractor={(item) => `ship-type-${item.id}`}
            renderItem={({ item }) => {
              const canAfford = ore >= item.cost;
              return (
                <View style={styles.typeCard}>
                  <View style={styles.typeHeader}>
                    <Ionicons
                      name={item.type === 'fighter' ? 'rocket' : 'construct'}
                      size={24}
                      color={item.type === 'fighter' ? COLORS.error : '#FFD700'}
                    />
                    <View style={styles.typeInfo}>
                      <Text style={styles.typeName}>
                        {item.name}
                      </Text>
                      <Text style={styles.typeCost}>
                        <Ionicons name="diamond" size={12} color="#FFD700" /> {item.cost} minerai
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.buyButton,
                        !canAfford && styles.buyDisabled,
                      ]}
                      onPress={() => onBuy(item.id)}
                      disabled={!canAfford}
                    >
                      <Text style={styles.buyText}>
                        {canAfford ? 'Acheter' : 'Trop cher'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Stats du type */}
                  <View style={styles.typeStats}>
                    <MiniStat label="PV" value={item.base_health} />
                    <MiniStat label="Attaque" value={item.damage} />
                    <MiniStat label="Portee atk" value={item.attack_range} />
                    <MiniStat label="Vitesse" value={item.speed} />
                    {item.type === 'miner' && (
                      <MiniStat label="Recolte" value={item.gathering_rate} />
                    )}
                  </View>
                </View>
              );
            }}
          />

          <Text style={styles.hint}>
            Apres achat, selectionnez une case libre pour deployer le vaisseau.
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const MiniStat = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.miniStat}>
    <Text style={styles.miniLabel}>{label}</Text>
    <Text style={styles.miniValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  oreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  oreText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  typeCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  typeCost: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buyDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },
  buyText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  typeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniStat: {
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  miniLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
  },
  miniValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  hint: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
