import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DeviceTypeIcon from './DeviceTypeIcon';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function DeviceHeader({ device }) {
  if (!device) return null;

  const getTypeColor = (type) => {
    switch (type) {
      case 'LIGHT':
        return '#eab308';
      case 'SWITCH_PANEL':
        return '#3b82f6';
      case 'CAMERA':
        return '#a855f7';
      case 'IRON':
        return '#ef4444';
      case 'OUTLET':
        return '#f97316';
      default:
        return colors.primary;
    }
  };

  const accentColor = getTypeColor(device.type);

  return (
    <View style={styles.header}>
      <View style={[styles.iconBox, { backgroundColor: `${accentColor}15` }]}>
        <DeviceTypeIcon type={device.type} status={device.status} size={32} color={accentColor} />
      </View>

      <View style={styles.titleGroup}>
        <Text style={styles.name}>{device.name}</Text>
        
        <View style={styles.tagRow}>
          <View style={[styles.tag, { borderColor: accentColor }]}>
            <Text style={[styles.tagText, { color: accentColor }]}>{device.type}</Text>
          </View>

          <Text style={styles.locationText}>
            {device.location?.room || 'General'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.large,
    marginTop: spacing.small,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.small,
  },
  tag: {
    borderWidth: 1,
    paddingHorizontal: spacing.small,
    paddingVertical: 1,
    borderRadius: borders.radius.small,
  },
  tagText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
});
