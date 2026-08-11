import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

/**
 * Reusable tile for displaying a single statistic with a label and value.
 * Optional accentColor tints the value text.
 */
export default function StatisticCard({ label, value, accentColor, style }) {
  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.value, accentColor ? { color: accentColor } : null]}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    flex: 1,
  },
  value: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
