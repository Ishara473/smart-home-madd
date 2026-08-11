import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { borders } from '../../../../shared/theme/borders';

export default function OutletControl({ device, updateDeviceState }) {
  const power = device.state?.power ?? false;

  const handleToggle = (value) => {
    updateDeviceState(device.id, { power: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlRow}>
        <Text style={styles.label}>Smart Outlet Power</Text>
        <Switch
          value={power}
          onValueChange={handleToggle}
          trackColor={{ false: colors.divider, true: `${colors.primary}50` }}
          thumbColor={power ? colors.primary : colors.textSecondary}
        />
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
  label: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
});
