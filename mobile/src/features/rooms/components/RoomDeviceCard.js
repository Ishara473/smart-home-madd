import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DeviceTypeIcon, DeviceStatusBadge } from '../../devices/components';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';

export default function RoomDeviceCard({ device, onPress }) {
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
  const isOnline = device.status !== 'DISCONNECTED';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressedCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconBox, { backgroundColor: `${accentColor}12` }]}>
          <DeviceTypeIcon type={device.type} status={device.status} size={20} color={accentColor} />
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.name} numberOfLines={1}>{device.name}</Text>
          <Text style={styles.typeLabel}>{device.type}</Text>
          
          <View style={styles.statusRow}>
            <View style={styles.badgeRow}>
              <View style={[styles.dot, { backgroundColor: isOnline ? '#10b981' : '#ef4444' }]} />
              <Text style={styles.statusLabel}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>

            {isOnline && device.isControllable && (
              <>
                <Text style={styles.bullet}>•</Text>
                <Text style={[styles.stateText, device.status === 'ON' ? styles.stateOn : styles.stateOff]}>
                  {device.status}
                </Text>
              </>
            )}
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.small,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  typeLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  statusLabel: {
    color: colors.textPrimary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
  },
  bullet: {
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  stateText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
  },
  stateOn: {
    color: colors.status.ON,
  },
  stateOff: {
    color: colors.textSecondary,
  },
});
