import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatisticCard from './StatisticCard';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function AutomationSummary({ data }) {
  if (!data) return null;

  const { executedRules = 0, successful = 0, failed = 0 } = data;
  const successRate = executedRules > 0
    ? ((successful / executedRules) * 100).toFixed(1)
    : '0.0';

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name="cog-clockwise" size={18} color="#a855f7" />
        <Text style={styles.sectionTitle}>Automation Activity</Text>
      </View>

      <View style={styles.statsRow}>
        <StatisticCard
          label="Rules Executed"
          value={String(executedRules)}
          accentColor={colors.primary}
          style={styles.statCard}
        />
        <StatisticCard
          label="Successful"
          value={String(successful)}
          accentColor={colors.success}
          style={styles.statCard}
        />
        <StatisticCard
          label="Failed"
          value={String(failed)}
          accentColor={failed > 0 ? colors.danger : colors.textSecondary}
          style={styles.statCard}
        />
      </View>

      {/* Success rate bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${successRate}%`,
              backgroundColor: parseFloat(successRate) >= 90 ? colors.success : colors.warning,
            },
          ]}
        />
      </View>
      <Text style={styles.progressLabel}>{successRate}% success rate</Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.small,
    marginBottom: spacing.medium,
  },
  statCard: {
    flex: 1,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
});
