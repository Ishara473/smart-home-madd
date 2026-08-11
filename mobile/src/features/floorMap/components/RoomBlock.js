import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function RoomBlock({ room, gridSize = 40 }) {
  if (!room) return null;

  const top = room.position.y * gridSize;
  const left = room.position.x * gridSize;
  const width = room.width * gridSize;
  const height = room.height * gridSize;

  return (
    <View
      style={[
        styles.block,
        {
          top,
          left,
          width: width - 2, // Slight offset for borders
          height: height - 2,
        },
      ]}
    >
      <Text style={styles.roomName}>{room.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: borders.radius.small,
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  roomName: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
});
