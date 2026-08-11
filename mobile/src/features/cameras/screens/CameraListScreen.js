import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import CameraList from '../components/CameraList';
import { useCameras } from '../hooks/useCameras';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export default function CameraListScreen() {
  const router = useRouter();
  const { cameras, loading, error } = useCameras();

  const handleCameraPress = (cameraId) => {
    router.push(`/cameras/${cameraId}`);
  };

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Surveillance Channels</Text>
        <Text style={styles.subtitle}>Configure and monitor live closed circuit camera feeds</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <LoadingIndicator message="Connecting to local DVR channel decoder..." />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <CameraList cameras={cameras} onCameraPress={handleCameraPress} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.small,
    paddingBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingLarge,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
  },
  errorText: {
    color: colors.status.DISCONNECTED,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
});
