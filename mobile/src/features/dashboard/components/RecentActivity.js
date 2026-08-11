import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) return null;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'TOGGLE':
        return 'power';
      case 'SAFETY':
        return 'shield-alert-outline';
      case 'STATUS':
        return 'information-outline';
      case 'CONNECT':
        return 'lan-connect';
      default:
        return 'bell-outline';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'SAFETY':
        return colors.status.ERROR;
      case 'TOGGLE':
        return colors.status.ON;
      case 'CONNECT':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      <View style={styles.card}>
        {/* Scrollable list container */}
        <ScrollView style={styles.scrollList} nestedScrollEnabled={true}>
          {activities.map((act, index) => {
            const iconColor = getActivityColor(act.type);
            return (
              <View key={act.id}>
                <View style={styles.activityRow}>
                  <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
                    <MaterialCommunityIcons
                      name={getActivityIcon(act.type)}
                      size={18}
                      color={iconColor}
                    />
                  </View>
                  
                  <View style={styles.info}>
                    <Text style={styles.deviceName}>{act.deviceName}</Text>
                    <Text style={styles.action}>{act.action}</Text>
                  </View>
                  
                  <Text style={styles.time}>{act.timestamp}</Text>
                </View>
                
                {index < activities.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.small,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.small,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    maxHeight: 220, // Restricts height for scrollability
  },
  scrollList: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.small,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.medium,
  },
  deviceName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  action: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginTop: 2,
  },
  time: {
    color: colors.textMuted,
    fontSize: typography.sizes.caption,
  },
  divider: {
    height: borders.width.thin,
    backgroundColor: colors.divider,
  },
});
