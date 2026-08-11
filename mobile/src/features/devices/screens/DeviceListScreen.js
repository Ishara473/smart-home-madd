import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useDevices } from '../hooks/useDevices';
import DeviceList from '../components/DeviceList';

export default function DeviceListScreen() {
  const router = useRouter();
  const { devices } = useDevices();
  const [loading, setLoading] = useState(true);

  // Simulate network load delay to satisfy future data architecture readiness
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(delay);
  }, []);

  const handleDevicePress = (deviceId) => {
    router.push(`/devices/${deviceId}`);
  };

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <View style={styles.header}>
        <Text style={styles.title}>All Devices</Text>
        <Text style={styles.subtitle}>Manage and monitor all active appliances</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <LoadingIndicator message="Connecting to local hub..." />
        </View>
      ) : (
        <DeviceList devices={devices} onPress={handleDevicePress} />
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
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
