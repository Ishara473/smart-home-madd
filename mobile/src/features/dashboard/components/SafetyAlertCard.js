import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function SafetyAlertCard({ alert }) {
  if (!alert) return null;

  const isHighSeverity = alert.severity === 'HIGH';
  const accentColor = isHighSeverity ? colors.status.ERROR : colors.status.DISCONNECTED;

  return (
    <View style={[styles.card, { borderColor: accentColor }]}>
      <View style={styles.topRow}>
        <Text style={[styles.severityTag, { backgroundColor: accentColor }]}>
          {alert.severity} PRIORITY
        </Text>
        <Text style={styles.timestamp}>{alert.timestamp}</Text>
      </View>

      <Text style={styles.alertTitle}>{alert.title}</Text>
      <Text style={styles.alertMessage}>{alert.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(20, 20, 30, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  severityTag: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    letterSpacing: 0.5,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
  alertTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  alertMessage: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
