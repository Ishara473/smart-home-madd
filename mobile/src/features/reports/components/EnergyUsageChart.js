import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

const BAR_MAX_HEIGHT = 80;
const BAR_COLOR = '#f59e0b';
const BAR_COLOR_PEAK = '#ef4444';

/**
 * Pure native bar chart — no external libraries.
 * Renders one column per day using View height proportional to value.
 */
export default function EnergyUsageChart({ dailyBreakdown = [], unit = 'Wh' }) {
  if (!dailyBreakdown.length) return null;

  const maxValue = Math.max(...dailyBreakdown.map(d => d.value), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Daily Breakdown</Text>

      <View style={styles.chartArea}>
        {dailyBreakdown.map((entry, index) => {
          const barHeight = Math.max(4, (entry.value / maxValue) * BAR_MAX_HEIGHT);
          const isPeak = entry.value === maxValue;

          return (
            <View key={index} style={styles.barColumn}>
              {/* Value label above bar */}
              <Text style={[styles.barValueLabel, isPeak && styles.barValueLabelPeak]}>
                {entry.value}
              </Text>

              {/* Bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isPeak ? BAR_COLOR_PEAK : BAR_COLOR,
                    },
                  ]}
                />
              </View>

              {/* Day label */}
              <Text style={styles.dayLabel}>{entry.day}</Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.unitLabel}>Values in {unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    marginBottom: spacing.small,
  },
  chartTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.medium,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + 32, // extra room for value labels
    paddingBottom: 0,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barValueLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
  barValueLabelPeak: {
    color: '#ef4444',
    fontWeight: typography.weights.bold,
  },
  barTrack: {
    width: '70%',
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
    borderRadius: borders.radius.small,
    overflow: 'hidden',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  bar: {
    width: '100%',
    borderRadius: borders.radius.small,
  },
  dayLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },
  unitLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.caption,
    textAlign: 'right',
    marginTop: spacing.small,
  },
});
