import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';
import DeviceTypeIcon from './DeviceTypeIcon';
import formatRelativeTime from '../utils/formatRelativeTime';

export default function DeviceList({ devices, onPress }) {
  const getTypeColor = (type) => {
    switch (type) {
      case 'LIGHT':
        return '#eab308'; // Yellow
      case 'SWITCH_PANEL':
        return '#3b82f6'; // Blue
      case 'CAMERA':
        return '#a855f7'; // Purple
      case 'IRON':
        return '#ef4444'; // Red
      case 'OUTLET':
        return '#f97316'; // Orange
      default:
        return colors.primary;
    }
  };

  const isOnline = (status) => {
    return status !== 'DISCONNECTED';
  };

  const renderDeviceItem = ({ item }) => {
    const online = isOnline(item.status);
    const accentColor = getTypeColor(item.type);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.pressedCard,
        ]}
        onPress={() => onPress(item.id)}
      >
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: `${accentColor}15` }]}>
            <DeviceTypeIcon type={item.type} status={item.status} size={22} color={accentColor} />
          </View>

          <View style={styles.detailsGroup}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            
            <View style={styles.subInfoRow}>
              <Text style={styles.roomText}>{item.room}</Text>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.statusBadge}>
                <View style={[styles.dot, { backgroundColor: online ? '#10b981' : '#ef4444' }]} />
                <Text style={styles.statusLabel}>{online ? 'Online' : 'Offline'}</Text>
              </View>

              {online && item.isControllable && (
                <>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.stateText, item.status === 'ON' ? styles.stateOn : styles.stateOff]}>
                    {item.status}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.timeGroup}>
            <Text style={styles.timeLabel}>Last updated</Text>
            <Text style={styles.timeValue}>{formatRelativeTime(item.lastUpdated)}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
        </View>
      </Pressable>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="devices-off" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No devices found</Text>
        <Text style={styles.emptySubtitle}>Add your first smart device to begin monitoring.</Text>
      </View>
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={devices}
      keyExtractor={(item) => item.id}
      renderItem={renderDeviceItem}
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    ...shadows.small,
  },
  pressedCard: {
    backgroundColor: colors.surfaceHighlight,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.small,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsGroup: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roomText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
  typeText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
  bullet: {
    color: colors.textMuted,
    marginHorizontal: spacing.xs,
    fontSize: typography.sizes.caption,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  statusLabel: {
    color: colors.textPrimary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
  },
  stateText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
  },
  stateOn: {
    color: colors.status.ON,
  },
  stateOff: {
    color: colors.textSecondary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  timeGroup: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    color: colors.textMuted,
    fontSize: 9,
    textTransform: 'uppercase',
  },
  timeValue: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    marginTop: 2,
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
