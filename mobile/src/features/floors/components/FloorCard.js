import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';

export default function FloorCard({ floor, onPress }) {
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
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="home-outline" size={24} color={colors.primary} />
        </View>
        
        <View style={styles.textGroup}>
          <Text style={styles.floorName}>{floor.name}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statText}>Rooms: {floor.roomCount}</Text>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.statText}>Devices: {floor.deviceCount}</Text>
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
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    ...shadows.small,
  },
  pressedCard: {
    backgroundColor: colors.surfaceHighlight,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  floorName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
  bullet: {
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
});
