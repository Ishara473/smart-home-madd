import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FloorCard from './FloorCard';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function FloorList({ floors, onFloorPress, onAddFloor }) {
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="layers-off" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No floors available</Text>
        <Text style={styles.emptySubtitle}>Start by adding a floor plan level to your smart home.</Text>
        {onAddFloor && (
          <Pressable
            style={({ pressed }) => [styles.emptyAddButton, pressed && { opacity: 0.7 }]}
            onPress={onAddFloor}
          >
            <MaterialCommunityIcons name="plus" size={18} color={colors.primary} />
            <Text style={styles.emptyAddButtonText}>Add First Floor</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={floors}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FloorCard floor={item} onPress={() => onFloorPress(item.id)} />
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
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.large,
    backgroundColor: `${colors.primary}15`,
    borderWidth: borders.width.thin,
    borderColor: colors.primary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borders.radius.medium,
  },
  emptyAddButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
});
