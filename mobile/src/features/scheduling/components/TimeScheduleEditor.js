import React from 'react';
import { StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function TimeScheduleEditor() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Schedule Editor</Text>
      
      <View style={styles.pickerRow}>
        <View style={styles.timeBox}>
          <Text style={styles.label}>Start Time</Text>
          <View style={styles.timeValueBox}>
            <Text style={styles.timeText}>18:00</Text>
          </View>
        </View>
        
        <View style={styles.timeBox}>
          <Text style={styles.label}>End Time</Text>
          <View style={styles.timeValueBox}>
            <Text style={styles.timeText}>23:00</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.labelText}>Enable Automated Trigger</Text>
        <Switch
          value={true}
          disabled={true}
          trackColor={{ false: colors.divider, true: `${colors.primary}50` }}
          thumbColor={colors.primary}
        />
      </View>

      <Pressable style={styles.saveButton}>
        <Text style={styles.saveText}>Save Schedule Slot</Text>
      </Pressable>
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
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleMedium,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.medium,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: spacing.medium,
    marginBottom: spacing.medium,
  },
  timeBox: {
    flex: 1,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginBottom: spacing.xs,
  },
  timeValueBox: {
    backgroundColor: colors.background,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borders.radius.small,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    alignItems: 'center',
  },
  timeText: {
    color: colors.primary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.medium,
  },
  labelText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
  },
  saveButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingVertical: spacing.small,
    borderRadius: borders.radius.small,
    borderWidth: borders.width.thin,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  saveText: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.body,
  },
});
