import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { useDevices } from '../hooks/useDevices';
import { useDevice } from '../hooks/useDevice';
import {
  DeviceHeader,
  DeviceInfoSection,
  DeviceControlPanel,
} from '../components';

export default function DeviceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { toggleSubSwitch } = useDevices();
  const { device, loading, error, updateDeviceState } = useDevice(id);

  if (loading) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <LoadingIndicator message="Fetching appliance node status..." />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !device) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Device not found</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push('/devices')}
          >
            <Text style={styles.backButtonText}>Return to Device List</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        {/* Header Back Link */}
        <Pressable
          style={styles.navBackLink}
          onPress={() => router.push('/devices')}
        >
          <Text style={styles.navBackLinkText}>← Back to All Devices</Text>
        </Pressable>

        {/* 1. Profile and Header */}
        <DeviceHeader device={device} />

        {/* 2. Controls Section */}
        <DeviceControlPanel
          device={device}
          updateDeviceState={updateDeviceState}
          toggleSubSwitch={toggleSubSwitch}
        />

        {/* 3. Properties and Info metrics */}
        <DeviceInfoSection device={device} />

        {/* 4. Scheduling options shortcut (LIGHT, IRON) */}
        {(device.type === 'LIGHT' || device.type === 'IRON') && (
          <Pressable
            style={({ pressed }) => [
              styles.scheduleButton,
              pressed && styles.scheduleButtonPressed,
            ]}
            onPress={() => router.push('/schedules')}
          >
            <Text style={styles.scheduleButtonText}>Configure Automated Schedules</Text>
          </Pressable>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.medium,
    paddingBottom: 100,
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
  navBackLink: {
    paddingVertical: spacing.small,
    marginBottom: spacing.small,
  },
  navBackLinkText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  scheduleButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: borders.width.thin,
    borderColor: colors.primary,
    padding: spacing.medium,
    borderRadius: borders.radius.medium,
    alignItems: 'center',
    marginTop: spacing.large,
  },
  scheduleButtonPressed: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
  },
  scheduleButtonText: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.body,
  },
});
