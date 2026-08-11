import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { borders } from '../../../../shared/theme/borders';

export default function IronControl({ device, updateDeviceState }) {
  const power = device?.state?.power ?? false;
  const maxDuration = device?.maxOnDuration || 15; // default 15 mins safety cap

  const handleToggle = (value) => {
    updateDeviceState(device.id, { power: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlRow}>
        <View style={styles.labelGroup}>
          <Text style={styles.label}>Power Status</Text>
          <Text style={styles.subLabel}>High-Power Heating Element</Text>
        </View>
        <Switch
          value={power}
          onValueChange={handleToggle}
          trackColor={{ false: colors.divider, true: `${colors.status.ERROR}60` }}
          thumbColor={power ? colors.status.ERROR : colors.textSecondary}
        />
      </View>

      <View style={styles.safetyCard}>
        <View style={styles.safetyHeader}>
          <MaterialCommunityIcons name="shield-alert-outline" size={20} color={colors.warning} />
          <Text style={styles.safetyTitle}>Safety Cutoff Guard</Text>
        </View>
        <Text style={styles.safetyText}>
          Auto-cutoff limit configured for <Text style={styles.highlight}>{maxDuration} minutes</Text>.
          Continuous operation past this duration will trigger an automatic shutdown and alert.
        </Text>
        {power && (
          <View style={styles.activeNotice}>
            <View style={styles.pulseDot} />
            <Text style={styles.activeText}>Safety timer actively monitoring node</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.small,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    padding: spacing.medium,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  labelGroup: {
    flex: 1,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  subLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginTop: 2,
  },
  safetyCard: {
    marginTop: spacing.medium,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: borders.width.thin,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  safetyTitle: {
    color: colors.warning,
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  safetyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    lineHeight: 18,
  },
  highlight: {
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
  activeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.small,
    paddingTop: spacing.xs,
    borderTopWidth: borders.width.thin,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.status.ERROR,
  },
  activeText: {
    color: colors.status.ERROR,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
  },
});
