import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { getFloorMap } from '../data/floorMapMockData';
import { FloorMapView } from '../components';
import { DeviceCard, useDevices } from '../../devices';

export default function InteractiveFloorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { devices: allDevices } = useDevices();

  const isFirstFloor = id === 'first-floor' || id === 'floor-first' || (id && String(id).toLowerCase().includes('first'));

  // Resolve mapping layout config
  const floorMap = getFloorMap(id);

  // Set of deviceIds explicitly placed on this floor's map grid
  const floorMapDeviceIds = new Set(
    (floorMap?.devices || []).map(d => d.deviceId)
  );

  // Filter live devices for this floor — match by floorId/floor/location.floor string,
  // OR if no floor tag is set on the device, fall back to checking if it's placed on this floor's map
  const floorDevices = allDevices.filter(d => {
    const dFloor = String(d.floorId || d.floor || d.location?.floor || '').toLowerCase();
    const hasFloorTag = dFloor.length > 0;

    if (isFirstFloor) {
      if (hasFloorTag) return dFloor.includes('first') || dFloor.includes('1st') || dFloor === 'floor-first';
      return floorMapDeviceIds.has(d.id);
    } else {
      if (hasFloorTag) return dFloor.includes('ground') || dFloor === 'floor-ground';
      return floorMapDeviceIds.has(d.id);
    }
  });

  const devices = floorDevices;
  const floorName = isFirstFloor ? 'First Floor' : 'Ground Floor';

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{floorName} Interactive Plan</Text>
        <Text style={styles.subtitle}>Tap device markers to view controls or toggle states</Text>

        {/* Dynamic Floor Grid Canvas */}
        <View style={styles.canvasContainer}>
          <FloorMapView floorMap={floorMap} />
        </View>

        {/* Legend */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Map Legend</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: colors.status.ON }]} />
              <Text style={styles.legendText}>Device Active (ON)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: colors.status.OFF }]} />
              <Text style={styles.legendText}>Device Inactive (OFF)</Text>
            </View>
          </View>
        </View>

        {/* Quick Device List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Devices Registered on this Floor</Text>
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onPress={() => router.push(`/devices/${device.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.medium,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingLarge,
    fontWeight: typography.weights.bold,
    marginTop: spacing.small,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    marginBottom: spacing.large,
  },
  canvasContainer: {
    paddingVertical: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendCard: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  legendTitle: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.small,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.large,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  legendText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.caption,
  },
  section: {
    marginTop: spacing.medium,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.small,
  },
});
