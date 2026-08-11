import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import NotificationTypeIcon from './NotificationTypeIcon';
import NotificationBadge from './NotificationBadge';
import formatRelativeTime from '../../devices/utils/formatRelativeTime';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';

export default function NotificationCard({ notification, onPress }) {
  if (!notification) return null;

  const isUnread = !notification.read;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isUnread && styles.cardUnread,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* Unread indicator strip */}
      {isUnread && <View style={styles.unreadStrip} />}

      <View style={styles.body}>
        <NotificationTypeIcon type={notification.type} size={20} />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={[styles.title, isUnread && styles.titleUnread]} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={styles.timestamp}>{formatRelativeTime(notification.timestamp)}</Text>
          </View>

          <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>

          <View style={styles.bottomRow}>
            <NotificationBadge severity={notification.severity} />
            {isUnread && <View style={styles.unreadDot} />}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    marginVertical: spacing.small,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    overflow: 'hidden',
    flexDirection: 'row',
    ...shadows.small,
  },
  cardUnread: {
    borderColor: 'rgba(59,130,246,0.25)',
    backgroundColor: 'rgba(59,130,246,0.04)',
  },
  cardPressed: {
    backgroundColor: colors.surfaceHighlight,
  },
  unreadStrip: {
    width: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: borders.radius.medium,
    borderBottomLeftRadius: borders.radius.medium,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.medium,
    gap: spacing.medium,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.medium,
    flex: 1,
    marginRight: spacing.small,
  },
  titleUnread: {
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    lineHeight: 18,
    marginBottom: spacing.small,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
