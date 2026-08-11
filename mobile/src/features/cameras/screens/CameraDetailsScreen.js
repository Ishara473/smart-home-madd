import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import CameraPreview from '../components/CameraPreview';
import CameraStatusBadge from '../components/CameraStatusBadge';
import CameraControls from '../components/CameraControls';
import { useCamera } from '../hooks/useCamera';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function CameraDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { camera, loading, error, updateCameraState } = useCamera(id);

  if (loading) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <LoadingIndicator message="Initializing closed circuit stream decoder..." />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !camera) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Camera feed details not found'}</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push('/cameras')}
          >
            <Text style={styles.backButtonText}>Return to Camera list</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const isRecordingActive = camera.state?.recording ?? false;
  const isOnline = camera.status === 'ONLINE';

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        {/* Navigation Back Link */}
        <Pressable
          style={styles.navBackLink}
          onPress={() => router.push('/cameras')}
        >
          <Text style={styles.navBackLinkText}>← Back to Surveillance Channels</Text>
        </Pressable>

        {/* 1. Camera Viewport Stream Preview */}
        <CameraPreview camera={camera} />

        {/* 2. Camera Profile Title Header */}
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{camera.name}</Text>
          <Text style={styles.subtitle}>
            {camera.location?.room || 'General'} • {camera.location?.floor || 'Ground Floor'}
          </Text>
          
          <View style={styles.badgesRow}>
            {/* Status Indicator */}
            <CameraStatusBadge status={camera.status} />

            {/* Pulses Recording Badge if active and online */}
            {isOnline && isRecordingActive && (
              <CameraStatusBadge status="RECORDING" />
            )}
          </View>
        </View>

        {/* 3. Settings Control panel */}
        <CameraControls camera={camera} updateCameraState={updateCameraState} />

        {/* 4. Specs sheet info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Appliance Connection info</Text>
          
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Node ID Identifier</Text>
            <Text style={styles.specVal}>{camera.deviceId}</Text>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Network Protocol Stream</Text>
            <Text style={styles.specVal}>{camera.streamUri || 'No active feed links'}</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.medium,
    paddingBottom: 100,
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
  headerInfo: {
    marginVertical: spacing.medium,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
    gap: spacing.small,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    marginTop: spacing.small,
  },
  infoCardTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.medium,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  specLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
  specVal: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.bold,
  },
});
