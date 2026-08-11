import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';

const TYPE_CONFIG = {
  ENERGY: {
    icon: 'lightning-bolt',
    color: '#f59e0b',
    summary: (data) => `${data.totalConsumption} ${data.unit}`,
  },
  DEVICE_HEALTH: {
    icon: 'heart-pulse',
    color: '#10b981',
    summary: (data) => `${data.onlineDevices} / ${data.totalDevices} Online`,
  },
  AUTOMATION: {
    icon: 'cog-clockwise',
    color: '#a855f7',
    summary: (data) => `${data.executedRules} rules executed`,
  },
};

export default function ReportCard({ report, onPress }) {
  if (!report) return null;

  const config = TYPE_CONFIG[report.type] || {
    icon: 'chart-bar',
    color: colors.primary,
    summary: () => '',
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconWrapper, { backgroundColor: `${config.color}15`, borderColor: `${config.color}30` }]}>
        <MaterialCommunityIcons name={config.icon} size={22} color={config.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{report.title}</Text>
        <Text style={styles.summary}>{config.summary(report.data)}</Text>
        <View style={styles.typePill}>
          <Text style={[styles.typeText, { color: config.color }]}>{report.type}</Text>
        </View>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    gap: spacing.medium,
    ...shadows.small,
  },
  cardPressed: {
    backgroundColor: colors.surfaceHighlight,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: borders.width.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  summary: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginTop: 2,
  },
  typePill: {
    marginTop: spacing.xs,
  },
  typeText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
