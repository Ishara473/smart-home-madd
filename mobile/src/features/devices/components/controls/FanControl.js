import React from 'react';
import { StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { borders } from '../../../../shared/theme/borders';

export default function FanControl({ device, updateDeviceState }) {
  const power = device.state?.power ?? false;
  const speed = device.state?.speed ?? 'MEDIUM';

  const handleToggle = (value) => {
    updateDeviceState(device.id, { power: value });
  };

  const handleSpeedSelect = (selectedSpeed) => {
    updateDeviceState(device.id, { speed: selectedSpeed });
  };

  const speeds = ['LOW', 'MEDIUM', 'HIGH'];

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
        <View style={styles.speedSection}>
          <Text style={styles.sectionLabel}>Fan Speed Mode</Text>
          
          <View style={styles.tabsRow}>
            {speeds.map((sp) => {
              const isActive = speed === sp;
              return (
                <Pressable
                  key={sp}
                  style={[
                    styles.tab,
                    isActive && styles.activeTab,
                  ]}
                  onPress={() => handleSpeedSelect(sp)}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {sp}
                  </Text>
                </Pressable>
              );
            })}
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
  speedSection: {
    marginTop: spacing.large,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    padding: spacing.medium,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.medium,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borders.radius.small,
    padding: 2,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borders.radius.small - 2,
  },
  activeTab: {
    backgroundColor: '#3b82f6', // Accent Blue for Fan
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.bold,
  },
  activeTabText: {
    color: colors.textPrimary,
  },
});
