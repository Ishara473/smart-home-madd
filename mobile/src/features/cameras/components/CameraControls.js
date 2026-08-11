import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function CameraControls({ camera, updateCameraState }) {
  if (!camera) return null;

  const isOnline = camera.status === 'ONLINE';
  const streaming = camera.state?.streaming ?? false;
  const recording = camera.state?.recording ?? false;
  const motionDetection = camera.state?.motionDetection ?? false;

  const handleToggle = (key, value) => {
    updateCameraState({ [key]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Monitoring Settings</Text>

      {/* Row 1: Live Stream Switch */}
      <View style={styles.controlRow}>
        <View style={styles.textGroup}>
          <Text style={styles.label}>Live Video Stream</Text>
          <Text style={styles.description}>Start/stop live thumbnail viewport feed</Text>
        </View>
        <Switch
          value={streaming}
          disabled={!isOnline}
          onValueChange={(val) => handleToggle('streaming', val)}
          trackColor={{ false: colors.divider, true: 'rgba(168, 85, 247, 0.4)' }}
          thumbColor={streaming && isOnline ? '#a855f7' : colors.textSecondary}
        />
      </View>

      <View style={styles.divider} />

      {/* Row 2: Recording Switch */}
      <View style={styles.controlRow}>
        <View style={styles.textGroup}>
          <Text style={styles.label}>Cloud Video Recording</Text>
          <Text style={styles.description}>Continuous DVR recording to smart hub local storage</Text>
        </View>
        <Switch
          value={recording}
          disabled={!isOnline}
          onValueChange={(val) => handleToggle('recording', val)}
          trackColor={{ false: colors.divider, true: 'rgba(168, 85, 247, 0.4)' }}
          thumbColor={recording && isOnline ? '#a855f7' : colors.textSecondary}
        />
      </View>

      <View style={styles.divider} />

      {/* Row 3: Motion Detection Switch */}
      <View style={styles.controlRow}>
        <View style={styles.textGroup}>
          <Text style={styles.label}>Motion Detection alerts</Text>
          <Text style={styles.description}>Send mobile push alert on movement detection events</Text>
        </View>
        <Switch
          value={motionDetection}
          disabled={!isOnline}
          onValueChange={(val) => handleToggle('motionDetection', val)}
          trackColor={{ false: colors.divider, true: 'rgba(168, 85, 247, 0.4)' }}
          thumbColor={motionDetection && isOnline ? '#a855f7' : colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  textGroup: {
    flex: 1,
    marginRight: spacing.medium,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginTop: 2,
  },
  divider: {
    height: borders.width.thin,
    backgroundColor: colors.divider,
    marginVertical: spacing.small,
  },
});
