import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DeviceStatusBadge from './DeviceStatusBadge';
import formatRelativeTime from '../utils/formatRelativeTime';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function DeviceInfoSection({ device }) {
  if (!device) return null;

  const getFloorName = (floorId) => {
    return floorId === 'ground-floor' ? 'Ground Floor' : 'First Floor';
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Device Information</Text>

      {/* Row 1: Connection status */}
      <View style={styles.row}>
        <Text style={styles.label}>Connection Status</Text>
        <DeviceStatusBadge status={device.status} />
      </View>

      <View style={styles.divider} />

      {/* Row 2: Location Room */}
      <View style={styles.row}>
        <Text style={styles.label}>Location Room</Text>
        <Text style={styles.value}>{device.location?.room || 'General'}</Text>
      </View>

      <View style={styles.divider} />

      {/* Row 3: Floor Name */}
      <View style={styles.row}>
        <Text style={styles.label}>Floor Plan Level</Text>
        <Text style={styles.value}>{getFloorName(device.location?.floor)}</Text>
      </View>

      <View style={styles.divider} />

      {/* Row 4: Power Usage */}
      <View style={styles.row}>
        <Text style={styles.label}>Current Power Load</Text>
        <Text style={[styles.value, styles.powerText]}>
          {device.powerConsumption ?? 0} Watts
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Row 5: Last updated */}
      <View style={styles.row}>
        <Text style={styles.label}>Last Synced Clock</Text>
        <Text style={styles.value}>{formatRelativeTime(device.lastUpdated)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
  },
  value: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  powerText: {
    color: colors.primary,
  },
  divider: {
    height: borders.width.thin,
    backgroundColor: colors.divider,
    marginVertical: spacing.small,
  },
});
