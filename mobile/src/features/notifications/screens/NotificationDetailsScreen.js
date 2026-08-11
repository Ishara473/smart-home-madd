import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import NotificationTypeIcon from '../components/NotificationTypeIcon';
import NotificationBadge from '../components/NotificationBadge';
import { useNotification } from '../hooks/useNotification';
import { useDevices } from '../../devices';
import formatRelativeTime from '../../devices/utils/formatRelativeTime';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function NotificationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { notification, loading, error, markAsRead } = useNotification(id);
  const { devices } = useDevices();

  // Auto-mark as read when the screen is opened
  useEffect(() => {
    if (notification && !notification.read) {
      markAsRead();
    }
  }, [notification?.id, notification?.read]);

  if (loading) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <LoadingIndicator message="Loading event details..." />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !notification) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Notification not found'}</Text>
          <Pressable style={styles.backButton} onPress={() => router.push('/notifications')}>
            <Text style={styles.backButtonText}>Return to Notifications</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const sourceDevice = devices.find(d => d.id === notification.source?.deviceId);

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Back navigation */}
        <Pressable style={styles.navBackLink} onPress={() => router.push('/notifications')}>
          <Text style={styles.navBackLinkText}>← Back to Notifications</Text>
        </Pressable>

        {/* Event header */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <NotificationTypeIcon type={notification.type} size={22} />
            <View style={styles.titleGroup}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.timestamp}>{formatRelativeTime(notification.timestamp)}</Text>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <NotificationBadge severity={notification.severity} />
            <View style={styles.typePill}>
              <Text style={styles.typePillText}>{notification.type}</Text>
            </View>
          </View>
        </View>

        {/* Message */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Event Message</Text>
          <Text style={styles.messageText}>{notification.message}</Text>
        </View>

        {/* Source device */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Event Source</Text>
          {sourceDevice ? (
            <>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Device Name</Text>
                <Text style={styles.specVal}>{sourceDevice.name}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Device Type</Text>
                <Text style={styles.specVal}>{sourceDevice.type}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Location</Text>
                <Text style={styles.specVal}>
                  {sourceDevice.location?.room} — {sourceDevice.location?.floor}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Source ID</Text>
                <Text style={styles.specVal}>{notification.source?.deviceId || 'Unknown'}</Text>
              </View>
            </>
          )}
        </View>

        {/* Timestamp and read status */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Event Metadata</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Recorded At</Text>
            <Text style={styles.specVal}>{new Date(notification.timestamp).toLocaleString()}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Read Status</Text>
            <Text style={[styles.specVal, { color: notification.read ? '#10b981' : colors.primary }]}>
              {notification.read ? 'Read' : 'Unread'}
            </Text>
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.xxl,
  },
  navBackLink: {
    paddingVertical: spacing.small,
    marginBottom: spacing.xs,
  },
  navBackLinkText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
  },
  errorText: {
    color: colors.status.DISCONNECTED,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  backButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: borders.width.thin,
    borderColor: colors.primary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borders.radius.small,
  },
  backButtonText: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  headerSection: {
    marginBottom: spacing.medium,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.medium,
    marginBottom: spacing.small,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
  },
  timestamp: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.small,
    alignItems: 'center',
  },
  typePill: {
    backgroundColor: colors.surface,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    borderRadius: borders.radius.round,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
  },
  typePillText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    marginBottom: spacing.small,
  },
  infoCardTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.medium,
  },
  messageText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    lineHeight: 22,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
    borderBottomWidth: borders.width.thin,
    borderBottomColor: colors.divider,
  },
  specLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    flex: 1,
  },
  specVal: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.bold,
    flex: 1,
    textAlign: 'right',
  },
});
