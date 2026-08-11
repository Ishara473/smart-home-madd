import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function CameraPreview({ camera }) {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!camera) return null;

  const isOnline = camera.status === 'ONLINE' || camera.status === 'ON';
  const isStreaming = (camera.state?.streaming ?? false) || isOnline;
  const isUnavailable = !isOnline || imageError;

  return (
    <View style={styles.container}>
      {isUnavailable ? (
        <View style={styles.fallbackContainer}>
          <MaterialCommunityIcons
            name={!isOnline ? 'video-off-outline' : 'alert-circle-outline'}
            size={48}
            color={!isOnline ? colors.status.DISCONNECTED : colors.textSecondary}
          />
          <Text style={styles.fallbackTitle}>
            {!isOnline ? 'Camera Offline' : 'Feed Offline'}
          </Text>
          <Text style={styles.fallbackSubtitle}>
            {!isOnline
              ? 'Appliance is disconnected from local smart hub'
              : 'Streaming is stopped. Enable feed to start live view.'}
          </Text>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          {camera.snapshotUri ? (
            <Image
              source={{ uri: camera.snapshotUri }}
              style={styles.image}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setImageError(true);
                setLoading(false);
              }}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noSnapshotView}>
              <MaterialCommunityIcons name="video" size={48} color="#a855f7" />
              <Text style={styles.noSnapshotTitle}>CAMERA FEED ACTIVE</Text>
              <Text style={styles.noSnapshotSubtitle}>Live feed stream placeholder</Text>
            </View>
          )}

          {loading && camera.snapshotUri && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#a855f7" />
            </View>
          )}
          
          {/* Overlay Status Live Info */}
          <View style={styles.liveOverlay}>
            <View style={styles.liveIndicator}>
              <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.liveText}>LIVE FEED</Text>
            </View>
          </View>

          {/* Custom watermark / feed info */}
          <Text style={styles.watermarkText}>
            {camera.name.toUpperCase()} • {new Date().toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    backgroundColor: '#05070a',
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.small,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.medium,
  },
  fallbackTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    marginTop: spacing.small,
  },
  fallbackSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginTop: 4,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noSnapshotView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSnapshotTitle: {
    color: '#a855f7',
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    marginTop: spacing.small,
    letterSpacing: 1,
  },
  noSnapshotSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginTop: 4,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  liveOverlay: {
    position: 'absolute',
    top: spacing.medium,
    left: spacing.medium,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xs,
    borderRadius: borders.radius.small,
    borderWidth: borders.width.thin,
    borderColor: '#ef4444',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  liveText: {
    color: '#ef4444',
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  watermarkText: {
    position: 'absolute',
    bottom: spacing.small,
    right: spacing.medium,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 9,
    fontFamily: 'monospace',
  },
});
