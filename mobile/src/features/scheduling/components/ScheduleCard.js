import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { useDevices } from '../../devices';

export default function ScheduleCard({ schedule, onToggle }) {
  const { getDevice } = useDevices();
  if (!schedule) return null;

  const device = getDevice(schedule.deviceId);
  const deviceName = device ? device.name : 'Unknown Device';

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Text style={styles.deviceName}>{deviceName}</Text>
        
        <View style={styles.metaRow}>
          <Text style={styles.typeTag}>{schedule.scheduleType}</Text>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.timeText}>
            {schedule.startTime} - {schedule.endTime}
          </Text>
        </View>
      </View>

      <Switch
        value={schedule.enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.divider, true: `${colors.primary}50` }}
        thumbColor={schedule.enabled ? colors.primary : colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  leftSection: {
    flex: 1,
  },
  deviceName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  typeTag: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: spacing.small,
    paddingVertical: 2,
    borderRadius: borders.radius.small,
  },
  bullet: {
    color: colors.textMuted,
    marginHorizontal: spacing.small,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
});
