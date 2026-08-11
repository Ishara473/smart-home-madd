import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { borders } from '../../../shared/theme/borders';

const TYPE_CONFIG = {
  SECURITY: { icon: 'cctv', color: '#ef4444' },
  DEVICE:   { icon: 'chip',  color: '#3b82f6' },
  AUTOMATION: { icon: 'clock-time-four-outline', color: '#a855f7' },
};

export default function NotificationTypeIcon({ type, size = 22 }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.DEVICE;

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}15`, borderColor: `${config.color}30` }]}>
      <MaterialCommunityIcons name={config.icon} size={size} color={config.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: borders.width.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
