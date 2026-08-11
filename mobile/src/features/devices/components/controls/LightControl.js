import React from 'react';
import { StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { borders } from '../../../../shared/theme/borders';

export default function LightControl({ device, updateDeviceState }) {
  const power = device.state?.power ?? false;
  const brightness = device.state?.brightness ?? 100;

  const handleToggle = (value) => {
    updateDeviceState(device.id, { power: value });
  };

  const handleBrightnessChange = (step) => {
    const nextBrightness = Math.max(10, Math.min(100, brightness + step));
    updateDeviceState(device.id, { brightness: nextBrightness });
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlRow}>
        <Text style={styles.label}>Power Status</Text>
        <Switch
          value={power}
          onValueChange={handleToggle}
          trackColor={{ false: colors.divider, true: `${colors.primary}50` }}
          thumbColor={power ? colors.primary : colors.textSecondary}
        />
      </View>

      {power && (
        <View style={styles.dimmerSection}>
          <Text style={styles.label}>Brightness ({brightness}%)</Text>
          
          <View style={styles.sliderMockRow}>
            <Pressable
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
              onPress={() => handleBrightnessChange(-10)}
            >
              <Text style={styles.btnText}>-</Text>
            </Pressable>

            <View style={styles.track}>
              <View style={[styles.bar, { width: `${brightness}%` }]} />
            </View>

            <Pressable
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
              onPress={() => handleBrightnessChange(10)}
            >
              <Text style={styles.btnText}>+</Text>
            </Pressable>
          </View>
        </View>
      )}
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
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  dimmerSection: {
    marginTop: spacing.large,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    padding: spacing.medium,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  sliderMockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.medium,
    gap: spacing.medium,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  btnPressed: {
    backgroundColor: colors.divider,
  },
  btnText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#eab308', // Accent Yellow color for Light
    borderRadius: 4,
  },
});
