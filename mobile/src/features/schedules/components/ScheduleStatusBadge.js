import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function ScheduleStatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return { color: '#10b981', label: 'ACTIVE' };
      case 'DISABLED':
      default:
        return { color: colors.textSecondary, label: 'DISABLED' };
    }
  };

  const { color, label } = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: `${color}15`, borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    borderRadius: borders.radius.round,
    borderWidth: borders.width.thin,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  text: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
