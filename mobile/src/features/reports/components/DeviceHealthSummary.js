import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatisticCard from './StatisticCard';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function DeviceHealthSummary({ data }) {
  if (!data) return null;

  const { totalDevices = 0, onlineDevices = 0, offlineDevices = 0 } = data;
  const healthPercent = totalDevices > 0
    ? ((onlineDevices / totalDevices) * 100).toFixed(1)
    : '0.0';

  const healthColor =
    parseFloat(healthPercent) >= 90 ? colors.success :
    parseFloat(healthPercent) >= 70 ? colors.warning :
    colors.danger;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="heart-pulse" size={18} color={colors.success} />
        <Text style={styles.sectionTitle}>Device Health</Text>
      </View>

      <View style={styles.statsRow}>
        <StatisticCard
          label="Online Devices"
          value={String(onlineDevices)}
          accentColor={colors.success}
          style={styles.statCard}
        />
        <StatisticCard
          label="Offline Devices"
          value={String(offlineDevices)}
          accentColor={offlineDevices > 0 ? colors.danger : colors.textSecondary}
          style={styles.statCard}
        />
        <StatisticCard
          label="System Health"
          value={`${healthPercent}%`}
          accentColor={healthColor}
          style={styles.statCard}
        />
      </View>

      {/* Health bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${healthPercent}%`, backgroundColor: healthColor }]} />
      </View>
      <Text style={styles.progressLabel}>{healthPercent}% of devices are online</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    marginBottom: spacing.small,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.small,
    marginBottom: spacing.medium,
  },
  statCard: {
    flex: 1,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
});
