import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { borders } from '../../../../shared/theme/borders';

export default function ThermostatControl({ device, updateDeviceState }) {
  const targetTemperature = device.state?.targetTemperature ?? 22;
  const currentTemperature = device.state?.currentTemperature ?? 24;

  const handleTempAdjust = (step) => {
    updateDeviceState(device.id, { targetTemperature: targetTemperature + step });
  };

  return (
    <View style={styles.container}>
      {/* 1. Visual Temperature Readings */}
      <View style={styles.readingsBox}>
        <View style={styles.readingItem}>
          <Text style={styles.readingLabel}>Current Room</Text>
          <Text style={styles.currentValue}>{currentTemperature}°C</Text>
        </View>

        <View style={styles.dividerVertical} />

        <View style={styles.readingItem}>
          <Text style={styles.readingLabel}>Target Setpoint</Text>
          <Text style={styles.targetValue}>{targetTemperature}°C</Text>
        </View>
      </View>

      {/* 2. Tactile Adjustment Buttons */}
      <View style={styles.adjustSection}>
        <Text style={styles.label}>Adjust Desired Temperature</Text>
        
        <View style={styles.buttonsRow}>
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={() => handleTempAdjust(-1)}
          >
            <Text style={styles.btnText}>-</Text>
          </Pressable>

          <View style={styles.gaugeBox}>
            <Text style={styles.setpointText}>{targetTemperature}°C</Text>
            <Text style={styles.setpointLabel}>Cooling active</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={() => handleTempAdjust(1)}
          >
            <Text style={styles.btnText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.small,
  },
  readingsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    padding: spacing.medium,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    marginBottom: spacing.large,
  },
  readingItem: {
    alignItems: 'center',
  },
  readingLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentValue: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  targetValue: {
    color: '#ef4444', // Red Accent for Target Thermostat Setpoint
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  dividerVertical: {
    width: borders.width.thin,
    height: 40,
    backgroundColor: colors.divider,
  },
  adjustSection: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    padding: spacing.medium,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    alignItems: 'center',
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.large,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
  },
  gaugeBox: {
    alignItems: 'center',
  },
  setpointText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingLarge,
    fontWeight: typography.weights.bold,
  },
  setpointLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
