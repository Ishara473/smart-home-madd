import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDevices } from '../../devices';
import { DeviceTypeIcon, DeviceStatusBadge } from '../../devices/components';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function DeviceReferenceItem({ deviceId }) {
  const router = useRouter();
  const { devices } = useDevices();
  
  const device = devices.find(d => d.id === deviceId);

  if (!device) {
    return (
      <View style={styles.missingContainer}>
        <Text style={styles.missingText}>Unknown Device ID: {deviceId}</Text>
      </View>
    );
  }

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
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressedContainer,
      ]}
      onPress={() => router.push(`/devices/${device.id}`)}
    >
      <View style={styles.leftRow}>
        <View style={[styles.iconBox, { backgroundColor: `${accentColor}10` }]}>
          <DeviceTypeIcon type={device.type} status={device.status} size={18} color={accentColor} />
        </View>
        <Text style={styles.deviceName} numberOfLines={1}>{device.name}</Text>
      </View>

      <View style={styles.rightRow}>
        <DeviceStatusBadge status={device.status} />
        <MaterialCommunityIcons name="chevron-right" size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.background,
    borderRadius: borders.radius.small,
    marginVertical: 4,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  pressedContainer: {
    backgroundColor: colors.surfaceHighlight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.small,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.small,
  },
  deviceName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  missingContainer: {
    padding: spacing.small,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borders.radius.small,
    marginVertical: 4,
  },
  missingText: {
    color: colors.status.DISCONNECTED,
    fontSize: typography.sizes.bodySmall,
  },
});
