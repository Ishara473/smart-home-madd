import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function HomeOverviewCard({ homeInfo }) {
  if (!homeInfo) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Home Overview</Text>
      <Text style={styles.homeName}>{homeInfo.name}</Text>

      <View style={styles.grid}>
        {/* Stat 1: Floors */}
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="layers" size={20} color={colors.textSecondary} />
          <Text style={styles.statValue}>{homeInfo.floorsCount}</Text>
          <Text style={styles.statLabel}>Total Floors</Text>
        </View>

        {/* Stat 2: Total Devices */}
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="devices" size={20} color={colors.textSecondary} />
          <Text style={styles.statValue}>{homeInfo.totalDevices}</Text>
          <Text style={styles.statLabel}>Total Devices</Text>
        </View>

        {/* Stat 3: Active Devices */}
        <View style={[styles.statCard, styles.activeBorder]}>
          <MaterialCommunityIcons name="power" size={20} color={colors.status.ON} />
          <Text style={[styles.statValue, styles.activeText]}>{homeInfo.activeDevices}</Text>
          <Text style={styles.statLabel}>Active Now</Text>
        </View>

        {/* Stat 4: Cameras */}
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="video" size={20} color={colors.textSecondary} />
          <Text style={styles.statValue}>{homeInfo.totalCameras || 2}</Text>
          <Text style={styles.statLabel}>Cameras</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.small,
  },
  headerTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  homeName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.large,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'flex-start',
  },
  activeBorder: {
    borderColor: 'rgba(0, 255, 136, 0.2)',
    backgroundColor: 'rgba(0, 255, 136, 0.05)',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: spacing.small,
    letterSpacing: -1,
  },
  activeText: {
    color: colors.status.ON,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
