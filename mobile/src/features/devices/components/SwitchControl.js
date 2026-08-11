import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function SwitchControl({ name, status, onToggle }) {
  const isChecked = status === 'ON';

  return (
    <View style={styles.container}>
      <Text style={styles.switchName}>{name}</Text>
      
      <View style={styles.rightSection}>
        <Text style={[styles.statusText, isChecked ? styles.onText : styles.offText]}>
          {status}
        </Text>
        <Switch
          value={isChecked}
          onValueChange={onToggle}
          trackColor={{ false: colors.divider, true: `${colors.primary}50` }}
          thumbColor={isChecked ? colors.primary : colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borders.radius.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  switchName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  statusText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
  },
  onText: {
    color: colors.status.ON,
  },
  offText: {
    color: colors.textSecondary,
  },
});
