import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../../shared/theme/colors';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { borders } from '../../../../shared/theme/borders';

export default function CameraControl({ device }) {
  const isOnline = device.status !== 'DISCONNECTED';

  return (
    <View style={styles.container}>
      <View style={styles.previewBox}>
        {isOnline ? (
          <View style={styles.activeFeed}>
            <MaterialCommunityIcons name="video" size={48} color="#a855f7" />
            <Text style={styles.feedTitle}>SURVEILLANCE FEED LIVE</Text>
            <Text style={styles.feedSubtitle}>{device.cameraUri || 'mock://camera/feed'}</Text>
            
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        ) : (
          <View style={styles.offlineFeed}>
            <MaterialCommunityIcons name="video-off-outline" size={48} color={colors.status.DISCONNECTED} />
            <Text style={styles.offlineTitle}>Camera Offline</Text>
            <Text style={styles.offlineSubtitle}>Check connection status or power cycle hub</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.small,
  },
  previewBox: {
    height: 220,
    backgroundColor: '#000000',
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFeed: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  feedTitle: {
    color: '#a855f7', // Purple accent for camera live feed title
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    marginTop: spacing.small,
    letterSpacing: 1,
  },
  feedSubtitle: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.medium,
    left: spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    borderRadius: borders.radius.small,
    borderWidth: borders.width.thin,
    borderColor: colors.status.ERROR,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.status.ERROR,
    marginRight: spacing.xs,
  },
  liveText: {
    color: colors.status.ERROR,
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  offlineFeed: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    marginTop: spacing.small,
  },
  offlineSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginTop: 4,
    textAlign: 'center',
  },
});
