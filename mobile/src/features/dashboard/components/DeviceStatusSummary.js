import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function DeviceStatusSummary({ statusSummary }) {
  if (!statusSummary) return null;

  const statuses = [
    { label: 'ON', value: statusSummary.on, color: colors.status.ON },
    { label: 'OFF', value: statusSummary.off, color: colors.status.OFF },
    { label: 'ERROR', value: statusSummary.error, color: colors.status.ERROR },
    { label: 'DISCONN', value: statusSummary.disconnected, color: colors.status.DISCONNECTED },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>Device Status Distribution</Text>
      
      <View style={styles.summaryContainer}>
        {statuses.map((item, index) => (
          <View key={index} style={styles.statusBox}>
            <View style={[styles.statusHeader, { borderColor: item.color }]}>
              <Text style={[styles.statusValue, { color: item.color }]}>{item.value}</Text>
            </View>
            <Text style={styles.statusLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
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
  headerTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.medium,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBox: {
    flex: 1,
    alignItems: 'center',
  },
  statusHeader: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: borders.width.thick,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.small,
  },
  statusValue: {
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.captionSmall,
    fontWeight: typography.weights.medium,
  },
});
