import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import RoomHeader from '../components/RoomHeader';
import RoomStatusSummary from '../components/RoomStatusSummary';
import RoomDeviceList from '../components/RoomDeviceList';
import { useRoom } from '../hooks/useRoom';
import { useRoomDevices } from '../hooks/useRoomDevices';
import { getRoomStatistics } from '../utils/roomStatistics';
import { FloorRepository } from '../../floors/repository/FloorRepository';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function RoomDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { room, loading, error } = useRoom(id);
  const devices = useRoomDevices(room);
  const statistics = getRoomStatistics(devices);

  // Retrieve parent floor name from floor repository layer
  const floorName = room ? FloorRepository.getFloorById(room.floorId)?.name || 'House Plan' : 'House Plan';

  const handleDevicePress = (deviceId) => {
    router.push(`/devices/${deviceId}`);
  };

  const handleBackPress = () => {
    if (room && room.floorId) {
      router.push(`/floors/${room.floorId}`);
    } else {
      router.push('/floors');
    }
  };

  if (loading) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <LoadingIndicator message="Analyzing room environment..." />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !room) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Room layout details not found'}</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.push('/floors')}
          >
            <Text style={styles.backButtonText}>Return to Floor Plans</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer useSafeArea={true} padding={false}>
      <View style={styles.container}>
        {/* Navigation Back Link */}
        <Pressable
          style={styles.navBackLink}
          onPress={handleBackPress}
        >
          <Text style={styles.navBackLinkText}>← Back to Floor Details</Text>
        </Pressable>

        {/* 1. Header Layout */}
        <RoomHeader
          roomName={room.name}
          floorName={floorName}
          iconName={room.metadata?.icon || 'home-outline'}
        />

        {/* 2. Status Summary badges */}
        <RoomStatusSummary statistics={statistics} />

        <Text style={styles.sectionTitle}>Room Appliances</Text>

        {/* 3. Devices FlatList layout */}
        <View style={styles.listWrapper}>
          <RoomDeviceList devices={devices} onPressDevice={handleDevicePress} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.medium,
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
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.small,
  },
  listWrapper: {
    flex: 1,
  },
});
