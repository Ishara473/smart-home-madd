import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FloorSummaryCard({ floor, onPress }) {
  if (!floor) return null;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressedCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.leftContainer}>
        <Text style={styles.floorName}>{floor.name}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="home-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{floor.roomCount || 0} Rooms</Text>
          </View>
          
          <Text style={styles.bullet}>•</Text>
          
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="devices" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{floor.deviceCount} Total</Text>
          </View>

          <Text style={styles.bullet}>•</Text>

          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="power" size={14} color={colors.status.ON} />
            <Text style={[styles.metaText, styles.activeColor]}>{floor.activeDevicesCount} Active</Text>
          </View>
        </View>
      </View>
      
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  pressedCard: {
    backgroundColor: colors.surfaceHighlight,
    transform: [{ scale: 0.98 }],
  },
  leftContainer: {
    flex: 1,
  },
  floorName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  activeColor: {
    color: colors.status.ON,
    fontWeight: '700',
  },
  bullet: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
