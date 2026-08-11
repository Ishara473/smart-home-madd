import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDevices } from '../../devices';
import ActionSummary from './ActionSummary';
import ScheduleStatusBadge from './ScheduleStatusBadge';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';

const getDeviceIcon = (type) => {
  switch (type) {
    case 'LIGHT': return 'lightbulb-outline';
    case 'FAN': return 'fan';
    case 'CAMERA': return 'video-outline';
    case 'OUTLET': return 'power-socket-us';
    case 'THERMOSTAT': return 'thermometer';
    case 'SWITCH_PANEL': return 'view-dashboard-outline';
    default: return 'chip';
  }
};

export default function ScheduleCard({ schedule, onPress }) {
  const { devices } = useDevices();

  if (!schedule) return null;

  const targetDevice = devices.find(d => d.id === schedule.action?.deviceId);
  const deviceType = targetDevice ? targetDevice.type : 'LIGHT';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressedCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.leftContainer}>
        {/* Trigger time box */}
        <View style={styles.triggerBox}>
          <MaterialCommunityIcons name="clock-outline" size={18} color={colors.primary} />
          <Text style={styles.triggerText}>{schedule.trigger?.value}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.name} numberOfLines={1}>{schedule.name}</Text>

          <View style={styles.actionRow}>
            <MaterialCommunityIcons
              name={getDeviceIcon(deviceType)}
              size={14}
              color={colors.textSecondary}
            />
            <ActionSummary action={schedule.action} textStyle={styles.summaryText} />
          </View>

          <View style={styles.badgeWrapper}>
            <ScheduleStatusBadge status={schedule.enabled ? 'ACTIVE' : 'DISABLED'} />
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
    marginRight: spacing.small,
  },
  triggerBox: {
    width: 60,
    height: 60,
    borderRadius: borders.radius.small,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderWidth: borders.width.thin,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  triggerText: {
    color: colors.primary,
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.bold,
  },
  infoGroup: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: spacing.xs,
  },
  summaryText: {
    fontSize: typography.sizes.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  badgeWrapper: {
    marginTop: spacing.small,
  },
});
