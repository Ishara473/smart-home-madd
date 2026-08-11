import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';
import { useDevices } from '../../devices';

export default function DeviceMarker({ deviceLocation, gridSize = 40 }) {
  const router = useRouter();
  const { getDevice } = useDevices();

  if (!deviceLocation) return null;

  const device = getDevice(deviceLocation.deviceId);
  if (!device) return null;

  const left = deviceLocation.position.x * gridSize + (gridSize - 32) / 2;
  const top = deviceLocation.position.y * gridSize + (gridSize - 32) / 2;

  let iconName = 'help-circle';
  switch (device.type) {
    case 'LIGHT':
      iconName = 'lightbulb';
      break;
    case 'OUTLET':
      iconName = 'power-plug';
      break;
    case 'SWITCH_PANEL':
      iconName = 'view-dashboard';
      break;
    case 'IRON':
      iconName = 'iron';
      break;
    case 'CAMERA':
      iconName = 'video';
      break;
  }

  const markerColor = colors.status[device.status] || colors.status.OFF;

  const handlePress = () => {
    router.push(`/devices/${device.id}`);
  };

  return (
    <Pressable
      style={[
        styles.marker,
        {
          top,
          left,
          backgroundColor: device.status === 'ON' ? `${markerColor}30` : colors.surface,
          borderColor: markerColor,
        },
      ]}
      onPress={handlePress}
    >
      <MaterialCommunityIcons name={iconName} size={16} color={markerColor} />
      {device.status === 'ON' && <View style={[styles.glowRing, { borderColor: markerColor }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  glowRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    opacity: 0.4,
  },
});
