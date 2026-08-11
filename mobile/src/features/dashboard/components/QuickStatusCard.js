import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function QuickStatusCard({ quickStatus }) {
  if (!quickStatus) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.headerTitle}>System Quick Status</Text>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Security System</Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: colors.status.ON }]} />
            <Text style={styles.value}>{quickStatus.security}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.item}>
          <Text style={styles.label}>Power Load</Text>
          <Text style={[styles.value, styles.primaryText]}>{quickStatus.powerUsage}</Text>
        </View>
      </View>

      <View style={styles.horizontalDivider} />

      <View style={styles.footerRow}>
        <Text style={styles.label}>System Integrity</Text>
        <Text style={styles.systemHealthText}>{quickStatus.systemHealth}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
  },
  value: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  primaryText: {
    color: colors.primary,
  },
  divider: {
    width: borders.width.thin,
    height: 40,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.medium,
  },
  horizontalDivider: {
    height: borders.width.thin,
    backgroundColor: colors.divider,
    marginVertical: spacing.medium,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  systemHealthText: {
    color: colors.status.ON,
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.bold,
  },
});
