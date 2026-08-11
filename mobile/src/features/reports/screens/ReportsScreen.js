import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import ReportCard from '../components/ReportCard';
import EnergyUsageChart from '../components/EnergyUsageChart';
import DeviceHealthSummary from '../components/DeviceHealthSummary';
import AutomationSummary from '../components/AutomationSummary';
import { useReports } from '../hooks/useReports';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ReportsScreen() {
  const { reports, loading, error } = useReports();

  const energyReport    = reports.find(r => r.type === 'ENERGY');
  const healthReport    = reports.find(r => r.type === 'DEVICE_HEALTH');
  const automationReport = reports.find(r => r.type === 'AUTOMATION');

  if (loading) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <LoadingIndicator message="Loading system analytics..." />
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>

        {/* Page header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reports & Analytics</Text>
          <Text style={styles.subtitle}>System performance overview for the current period</Text>
        </View>

        {/* ── Summary widgets ── */}
        <Text style={styles.sectionLabel}>System Overview</Text>

        {healthReport && (
          <DeviceHealthSummary data={healthReport.data} />
        )}

        {automationReport && (
          <AutomationSummary data={automationReport.data} />
        )}

        {energyReport && (
          <EnergyUsageChart
            dailyBreakdown={energyReport.data.dailyBreakdown}
            unit={energyReport.data.unit}
          />
        )}

        {/* ── Report cards list ── */}
        <Text style={styles.sectionLabel}>All Reports</Text>

        {reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="chart-box-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No reports available</Text>
            <Text style={styles.emptySubtitle}>Analytics data will appear here once events are recorded.</Text>
          </View>
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        )}

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.medium,
    paddingBottom: 120,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  header: {
    paddingTop: spacing.small,
    marginBottom: spacing.medium,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingLarge,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    marginTop: 2,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.small,
    marginTop: spacing.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    marginTop: spacing.medium,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.large,
  },
});
