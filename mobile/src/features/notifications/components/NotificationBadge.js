import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

const SEVERITY_CONFIG = {
  INFO:    { color: '#3b82f6', label: 'INFO' },
  WARNING: { color: '#f59e0b', label: 'WARNING' },
  ERROR:   { color: '#ef4444', label: 'ERROR' },
};

export default function NotificationBadge({ severity }) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.INFO;

  return (
    <View style={[styles.badge, { backgroundColor: `${config.color}15`, borderColor: config.color }]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    borderRadius: borders.radius.round,
    borderWidth: borders.width.thin,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
