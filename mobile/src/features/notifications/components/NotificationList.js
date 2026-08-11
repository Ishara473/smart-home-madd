import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NotificationCard from './NotificationCard';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export default function NotificationList({ notifications, onNotificationPress }) {
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="bell-off-outline" size={48} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>All clear</Text>
      <Text style={styles.emptySubtitle}>No system alerts or events have been recorded yet.</Text>
    </View>
  );

  return (
    <FlatList
      style={{ flex: 1 }}
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NotificationCard
          notification={item}
          onPress={() => onNotificationPress(item.id)}
        />
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
