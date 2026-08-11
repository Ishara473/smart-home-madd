import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function FloorPlanView({ floorId }) {
  // Define layout mapping depending on selected floor
  const isGroundFloor = floorId === 'ground-floor';

  const roomsLayout = isGroundFloor
    ? [
        { name: 'Living Room', flex: 2, color: 'rgba(59, 130, 246, 0.1)', border: colors.primary, devices: 4 },
        { name: 'Kitchen', flex: 1.5, color: 'rgba(16, 185, 129, 0.1)', border: colors.status.ON, devices: 2 },
        { name: 'Garage', flex: 1.5, color: 'rgba(245, 158, 11, 0.1)', border: colors.status.ERROR, devices: 2 }
      ]
    : [
        { name: 'Bedroom', flex: 2, color: 'rgba(99, 102, 241, 0.1)', border: colors.secondary, devices: 4 },
        { name: 'Bathroom', flex: 1, color: 'rgba(239, 68, 68, 0.1)', border: colors.status.DISCONNECTED, devices: 2 }
      ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Abstract Grid Mapping Overlay</Text>
      
      {/* Visual representation of floor layout grid */}
      <View style={styles.gridContainer}>
        {/* Render floor cells split by room flexes */}
        {roomsLayout.map((room, idx) => (
          <View
            key={idx}
            style={[
              styles.roomBlock,
              {
                flex: room.flex,
                backgroundColor: room.color,
                borderColor: room.border,
              },
            ]}
          >
            <Text style={styles.roomLabel}>{room.name}</Text>
            <Text style={styles.devicesLabel}>{room.devices} device slots</Text>
            
            {/* Device Marker Dots Placeholders */}
            <View style={styles.markersContainer}>
              {Array.from({ length: room.devices }).map((_, markerIdx) => (
                <View
                  key={markerIdx}
                  style={[
                    styles.deviceMarker,
                    { backgroundColor: room.border }
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Device Node Slot</Text>
        </View>
        <Text style={styles.footerNote}>Drag & drop mapping disabled in mock view</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    marginVertical: spacing.small,
  },
  header: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.medium,
  },
  gridContainer: {
    height: 220,
    borderRadius: borders.radius.small,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
    overflow: 'hidden',
    flexDirection: 'column',
    gap: spacing.xs,
    padding: spacing.xs,
    backgroundColor: colors.background,
  },
  roomBlock: {
    borderRadius: borders.radius.small,
    borderWidth: borders.width.thin,
    padding: spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  roomLabel: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleMedium,
    fontWeight: typography.weights.bold,
  },
  devicesLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.captionSmall,
    marginTop: 2,
  },
  markersContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.small,
  },
  deviceMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.medium,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
  },
  footerNote: {
    color: colors.textMuted,
    fontSize: typography.sizes.captionSmall,
    fontStyle: 'italic',
  },
});
