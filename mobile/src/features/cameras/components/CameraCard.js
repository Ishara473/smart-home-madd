import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';
import CameraStatusBadge from './CameraStatusBadge';

export default function CameraCard({ camera, onPress }) {
  if (!camera) return null;

  const isOnline = camera.status === 'ONLINE' || camera.status === 'ON';
  const isStreaming = (camera.state?.streaming ?? false) || isOnline;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressedCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.leftContainer}>
        <View style={[styles.iconBox, { backgroundColor: isOnline ? 'rgba(168, 85, 247, 0.12)' : colors.divider }]}>
          <MaterialCommunityIcons
            name={isOnline ? 'video' : 'video-off'}
            size={22}
            color={isOnline ? '#a855f7' : colors.textSecondary}
          />
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.name} numberOfLines={1}>{camera.name}</Text>
          <Text style={styles.roomText}>{camera.location?.room || 'General'}</Text>
          
          <View style={styles.statusRow}>
            <CameraStatusBadge status={camera.status} />
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.streamLabel, isStreaming ? styles.streamActive : styles.streamInactive]}>
              {isStreaming ? 'Streaming' : 'Feed Offline'}
            </Text>
          </View>
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
    justifyContent: 'space-between',
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    ...shadows.small,
  },
  pressedCard: {
    backgroundColor: colors.surfaceHighlight,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.small,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  roomText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  bullet: {
    color: colors.textMuted,
    marginHorizontal: 2,
  },
  streamLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
  },
  streamActive: {
    color: '#a855f7',
  },
  streamInactive: {
    color: colors.textSecondary,
  },
});
