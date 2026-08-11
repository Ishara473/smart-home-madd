import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function RoomStatusSummary({ statistics }) {
  if (!statistics) return null;

  const { total, online, active } = statistics;

  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{total}</Text>
        <Text style={styles.statLabel}>Total Devices</Text>
      </View>

      <View style={styles.dividerVertical} />

      <View style={styles.statBox}>
        <View style={styles.badgeRow}>
          <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.statValue}>{online}</Text>
        </View>
        <Text style={styles.statLabel}>Online</Text>
      </View>

      <View style={styles.dividerVertical} />

      <View style={styles.statBox}>
        <View style={styles.badgeRow}>
          <View style={[styles.dot, { backgroundColor: colors.status.ON }]} />
          <Text style={styles.statValue}>{active}</Text>
        </View>
        <Text style={styles.statLabel}>Active Now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    paddingVertical: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    marginBottom: spacing.large,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dividerVertical: {
    width: borders.width.thin,
    height: 36,
    backgroundColor: colors.divider,
  },
});
