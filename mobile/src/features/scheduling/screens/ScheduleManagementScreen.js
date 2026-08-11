import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useSchedules } from '../hooks/useSchedules';
import { ScheduleCard, DurationLimitCard, TimeScheduleEditor } from '../components';

export default function ScheduleManagementScreen() {
  const { schedules, safetyRules, enableSchedule, disableSchedule } = useSchedules();

  const handleToggleSchedule = (id, enabled) => {
    if (enabled) {
      disableSchedule(id);
    } else {
      enableSchedule(id);
    }
  };

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Scheduling & Safety Rules</Text>
        <Text style={styles.subtitle}>Manage automated timers and fire safety cutoffs</Text>

        {/* 1. Safety Cutoff Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Server-Side Safety Rules</Text>
          {safetyRules.map((rule) => (
            <DurationLimitCard key={rule.id} rule={rule} />
          ))}
        </View>

        {/* 2. Custom Time Schedules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automated Operation Slots</Text>
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onToggle={() => handleToggleSchedule(schedule.id, schedule.enabled)}
            />
          ))}
        </View>

        {/* 3. Time Schedule Editor Placeholder */}
        <TimeScheduleEditor />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.medium,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingLarge,
    fontWeight: typography.weights.bold,
    marginTop: spacing.small,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    marginBottom: spacing.medium,
  },
  section: {
    marginVertical: spacing.small,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.small,
  },
});
