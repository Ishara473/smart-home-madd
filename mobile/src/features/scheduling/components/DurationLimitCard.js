import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { useDevices } from '../../devices';
import { getElapsedSeconds } from '../utils/safetyTimer';

export default function DurationLimitCard({ rule }) {
  const { getDevice } = useDevices();
  const [elapsed, setElapsed] = useState(0);

  if (!rule) return null;

  const device = getDevice(rule.deviceId);
  const deviceName = device ? device.name : 'Unknown Device';
  const isDeviceActive = device && device.status === 'ON';

  // Run a visual tick counter when device is active
  useEffect(() => {
    if (!isDeviceActive) {
      setElapsed(0);
      return;
    }

    setElapsed(getElapsedSeconds(rule.deviceId));
    const interval = setInterval(() => {
      setElapsed(getElapsedSeconds(rule.deviceId));
    }, 1000);

    return () => clearInterval(interval);
  }, [isDeviceActive, rule.deviceId]);

  const maxDuration = rule.maxOnDuration;
  const remaining = Math.max(0, maxDuration - elapsed);
  const progressRatio = Math.min(1, elapsed / maxDuration);

  return (
    <View style={[styles.card, isDeviceActive && styles.activeCardBorder]}>
      <Text style={styles.header}>Safety Rule Overview</Text>
      <Text style={styles.deviceName}>{deviceName}</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Max Permissible Duration</Text>
        <Text style={styles.value}>{maxDuration} seconds (Demo Mode)</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Cutoff Timer Status</Text>
        <Text style={[styles.value, isDeviceActive ? styles.activeText : styles.standbyText]}>
          {isDeviceActive ? `Cutoff in ${remaining}s` : 'Standby'}
        </Text>
      </View>

      {/* Visual countdown progress bar */}
      {isDeviceActive && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progressRatio * 100}%`,
                backgroundColor: progressRatio > 0.7 ? colors.status.ERROR : colors.primary
              }
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  activeCardBorder: {
    borderColor: colors.status.ERROR,
  },
  header: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  deviceName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
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
  activeText: {
    color: colors.status.ERROR,
  },
  standbyText: {
    color: colors.status.OFF,
  },
  divider: {
    height: borders.width.thin,
    backgroundColor: colors.divider,
    marginVertical: spacing.small,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.divider,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: spacing.medium,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
