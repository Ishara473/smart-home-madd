import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScheduleCard from './ScheduleCard';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export default function ScheduleList({ schedules, onSchedulePress }) {
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="clock-alert-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No automation rules</Text>
        <Text style={styles.emptySubtitle}>No automation rules or time-based schedules have been mapped yet.</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={schedules}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ScheduleCard schedule={item} onPress={() => onSchedulePress(item.id)} />
      )}
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={true}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    padding: spacing.medium,
    paddingBottom: 120,
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
