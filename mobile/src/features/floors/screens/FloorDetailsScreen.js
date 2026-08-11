import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import LoadingIndicator from '../../../shared/components/LoadingIndicator';
import RoomList from '../components/RoomList';
import { useFloor } from '../hooks/useFloor';
import { roomRepository as firebaseRoomRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { RoomRepository as MockRoomRepository } from '../../rooms/repository/RoomRepository';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function FloorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { floor, loading: floorLoading, error: floorError } = useFloor(id);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState(null);

  useEffect(() => {
    if (!id) return;

    if (shouldUseMockData()) {
      const delay = setTimeout(() => {
        try {
          const allRooms = MockRoomRepository.getRooms();
          const floorRooms = allRooms.filter(room => room.floorId === id);
          setRooms(floorRooms);
        } catch (err) {
          setRoomsError('Failed to load rooms');
        } finally {
          setRoomsLoading(false);
        }
      }, 500);
      return () => clearTimeout(delay);
    }

    if (!isFirebaseConfigured()) {
      setRooms([]);
      setRoomsLoading(false);
      return;
    }

    // Wait until the floor document is loaded so we have floor.homeId
    // (required by Firestore security rules that check isHomeMember(homeId))
    if (!floor) return;

    let isMounted = true;
    setRoomsLoading(true);
    setRoomsError(null);

    firebaseRoomRepository.getRoomsByFloor(id, floor.homeId)
      .then(data => {
        if (isMounted) {
          setRooms(data);
          setRoomsError(null);
        }
      })
      .catch(err => {
        console.error('[FloorDetailsScreen] Failed to load rooms', err);
        if (isMounted) setRoomsError('Unable to load rooms');
      })
      .finally(() => {
        if (isMounted) setRoomsLoading(false);
      });

    return () => { isMounted = false; };
  }, [id, floor]);

  if (floorLoading || roomsLoading) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <LoadingIndicator message="Analyzing floor boundaries..." />
        </View>
      </ScreenContainer>
    );
  }

  if (floorError || !floor) {
    return (
      <ScreenContainer useSafeArea={true}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{floorError || 'Floor layout details not found'}</Text>
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
      <View style={styles.header}>
        <Pressable
          style={styles.navBackLink}
          onPress={() => router.push('/floors')}
        >
          <Text style={styles.navBackLinkText}>← Back to Floor Plans</Text>
        </Pressable>

        <Text style={styles.title}>{floor.name} Layout</Text>
        <Text style={styles.subtitle}>
          Registered room zones and current active devices count
        </Text>

        <Pressable
          style={styles.mapButton}
          onPress={() => router.push(`/floors/${id}/map`)}
        >
          <Text style={styles.mapButtonText}>View Floor Plan Map</Text>
        </Pressable>
      </View>

      <RoomList rooms={rooms} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.small,
    paddingBottom: spacing.xs,
  },
  navBackLink: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  navBackLinkText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
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
  mapButton: {
    marginTop: spacing.medium,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: borders.width.thin,
    borderColor: '#00ff88',
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: borders.radius.small,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#00ff88',
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.body,
  },
});
