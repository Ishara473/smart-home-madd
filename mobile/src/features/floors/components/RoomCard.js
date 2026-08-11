import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DeviceReferenceList from './DeviceReferenceList';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';

export default function RoomCard({ room }) {
  const router = useRouter();

  if (!room) return null;

  const deviceCount = room.devices?.length || 0;

  const handleHeaderPress = () => {
    router.push(`/rooms/${room.id}`);
  };

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [
          styles.header,
          pressed && styles.pressedHeader,
        ]}
        onPress={handleHeaderPress}
      >
        <View style={styles.titleGroup}>
          <Text style={styles.roomName}>{room.name}</Text>
          {room.metadata?.area && (
            <Text style={styles.areaText}>{room.metadata.area}</Text>
          )}
        </View>
        <View style={styles.rightGroup}>
          <Text style={styles.countText}>
            {deviceCount} {deviceCount === 1 ? 'device' : 'devices'}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color={colors.primary} />
        </View>
      </Pressable>

      <DeviceReferenceList deviceIds={room.devices} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: borders.width.thin,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.small,
    paddingHorizontal: 2,
  },
  pressedHeader: {
    opacity: 0.7,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.small,
  },
  roomName: {
    color: colors.textPrimary,
    fontSize: typography.sizes.bodyLarge,
    fontWeight: typography.weights.bold,
  },
  areaText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  countText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
});
