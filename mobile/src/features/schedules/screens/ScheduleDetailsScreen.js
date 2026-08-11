import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import ScheduleStatusBadge from '../components/ScheduleStatusBadge';
import ActionSummary from '../components/ActionSummary';
import { useSchedule } from '../hooks/useSchedule';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function ScheduleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { schedule, loading, error, updateScheduleState } = useSchedule(id);

  if (loading) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <LoadingIndicator message="Loading automation rule..." />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !schedule) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Automation rule not found'}</Text>
          <Pressable style={styles.backButton} onPress={() => router.push('/schedules')}>
            <Text style={styles.backButtonText}>Return to Schedules</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const handleToggleEnabled = (value) => {
    updateScheduleState({ enabled: value });
  };

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>

        {/* Back navigation */}
        <Pressable style={styles.navBackLink} onPress={() => router.push('/schedules')}>
          <Text style={styles.navBackLinkText}>← Back to Schedules</Text>
        </Pressable>

        {/* Title header */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={28} color={colors.primary} />
            <Text style={styles.title}>{schedule.name}</Text>
          </View>
          <View style={styles.badgeRow}>
            <ScheduleStatusBadge status={schedule.enabled ? 'ACTIVE' : 'DISABLED'} />
          </View>
        </View>

        {/* Trigger card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Trigger Condition</Text>
          <View style={styles.triggerDisplay}>
            <MaterialCommunityIcons name="clock-outline" size={32} color={colors.primary} />
            <View style={styles.triggerTextGroup}>
              <Text style={styles.triggerType}>{schedule.trigger?.type}</Text>
              <Text style={styles.triggerValue}>{schedule.trigger?.value}</Text>
            </View>
          </View>
        </View>

        {/* Action card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Automation Action</Text>
          <View style={styles.actionDisplay}>
            <MaterialCommunityIcons name="play-circle-outline" size={24} color="#10b981" />
            <View style={styles.actionTextGroup}>
              <Text style={styles.actionLabel}>Execute:</Text>
              <ActionSummary action={schedule.action} textStyle={styles.actionSummaryText} />
            </View>
          </View>
          <View style={styles.deviceIdRow}>
            <Text style={styles.specLabel}>Target Device ID</Text>
            <Text style={styles.specVal}>{schedule.action?.deviceId}</Text>
          </View>
        </View>

        {/* Enable / Disable toggle control */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Schedule Control</Text>
          <View style={styles.controlRow}>
            <View style={styles.controlTextGroup}>
              <Text style={styles.controlLabel}>Enable Automation Rule</Text>
              <Text style={styles.controlDescription}>
                {schedule.enabled
                  ? 'This schedule is active and will execute automatically'
                  : 'This schedule is disabled and will not execute'}
              </Text>
            </View>
            <Switch
              value={schedule.enabled}
              onValueChange={handleToggleEnabled}
              trackColor={{ false: colors.divider, true: 'rgba(59, 130, 246, 0.4)' }}
              thumbColor={schedule.enabled ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>

        {/* Execution history */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Execution History</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Last Executed</Text>
            <Text style={styles.specVal}>
              {schedule.lastExecuted
                ? new Date(schedule.lastExecuted).toLocaleString()
                : 'Never executed'}
            </Text>
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.xxl,
  },
  navBackLink: {
    paddingVertical: spacing.small,
    marginBottom: spacing.xs,
  },
  navBackLinkText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
  },
  errorText: {
    color: colors.status.DISCONNECTED,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  backButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: borders.width.thin,
    borderColor: colors.primary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borders.radius.small,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  headerSection: {
    marginBottom: spacing.medium,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
    marginBottom: spacing.small,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    marginBottom: spacing.small,
  },
  infoCardTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.medium,
  },
  triggerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.medium,
  },
  triggerTextGroup: {
    flex: 1,
  },
  triggerType: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  triggerValue: {
    color: colors.primary,
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  actionDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.medium,
    marginBottom: spacing.small,
  },
  actionTextGroup: {
    flex: 1,
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginBottom: 2,
  },
  actionSummaryText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  deviceIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.small,
    borderTopWidth: borders.width.thin,
    borderTopColor: colors.divider,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlTextGroup: {
    flex: 1,
    marginRight: spacing.medium,
  },
  controlLabel: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  controlDescription: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginTop: 2,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
  specVal: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.bold,
  },
});
