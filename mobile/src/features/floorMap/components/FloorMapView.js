import React from 'react';
import { StyleSheet, View } from 'react-native';
import FloorGrid from './FloorGrid';
import RoomBlock from './RoomBlock';
import DeviceMarker from './DeviceMarker';
import { borders } from '../../../shared/theme/borders';
import { colors } from '../../../shared/theme/colors';

export default function FloorMapView({ floorMap }) {
  if (!floorMap) return null;

  const width = floorMap.width * floorMap.gridSize;
  const height = floorMap.height * floorMap.gridSize;

  return (
    <View style={[styles.outerContainer, { width, height }]}>
      {/* 1. Grid Background Coordinate System */}
      <FloorGrid
        width={floorMap.width}
        height={floorMap.height}
        gridSize={floorMap.gridSize}
      />

      {/* 2. Room Bound Blocks */}
      {floorMap.rooms.map((room) => (
        <RoomBlock
          key={room.id}
          room={room}
          gridSize={floorMap.gridSize}
        />
      ))}

      {/* 3. Interactive Device Markers */}
      {floorMap.devices.map((deviceLoc) => (
        <DeviceMarker
          key={deviceLoc.deviceId}
          deviceLocation={deviceLoc}
          gridSize={floorMap.gridSize}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    alignSelf: 'center',
    borderRadius: borders.radius.medium,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: '#070b13',
  },
});
