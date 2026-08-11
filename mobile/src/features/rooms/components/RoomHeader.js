import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function RoomHeader({ roomName, floorName, iconName = 'home-outline' }) {
  return (
    <View style={styles.header}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={iconName} size={28} color={colors.primary} />
      </View>

      <View style={styles.titleGroup}>
        <Text style={styles.roomTitle}>{roomName}</Text>
        <Text style={styles.floorSubtitle}>{floorName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.large,
    marginTop: spacing.small,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  roomTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.headingMedium,
    fontWeight: typography.weights.bold,
  },
  floorSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.body,
    marginTop: 2,
  },
});
