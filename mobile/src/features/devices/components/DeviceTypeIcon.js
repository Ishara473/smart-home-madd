import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { borders } from '../../../shared/theme/borders';

export default function DeviceTypeIcon({ type, status, size = 24 }) {
  let iconName = 'help-circle-outline';
  
  switch (type) {
    case 'LIGHT':
      iconName = 'lightbulb-outline';
      break;
    case 'OUTLET':
      iconName = 'power-socket-us';
      break;
    case 'SWITCH_PANEL':
      iconName = 'view-dashboard-outline';
      break;
    case 'IRON':
      iconName = 'iron';
      break;
    case 'CAMERA':
      iconName = 'video-outline';
      break;
  }

  const iconColor = status === 'ON' ? colors.primary : colors.textSecondary;

  return (
    <View style={[styles.iconContainer, { borderColor: status === 'ON' ? colors.primary : colors.divider }]}>
      <MaterialCommunityIcons name={iconName} size={size} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
});
