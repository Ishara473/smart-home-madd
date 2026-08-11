import React from 'react';
import { StyleSheet, Text, View, Pressable, Switch } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';
import { shadows } from '../../../shared/theme/shadows';
import DeviceTypeIcon from './DeviceTypeIcon';
import DeviceStatusBadge from './DeviceStatusBadge';
import { useDevices } from '../hooks/useDevices';

export default function DeviceCard({ device, onPress }) {
  const { toggleDevice } = useDevices();

  if (!device) return null;

  const isAlarming = device.status === 'ERROR';
  const isSwitchControlled = 
    device.isControllable && 
    device.type !== 'CAMERA' && 
    device.type !== 'SWITCH_PANEL';

  const handleToggle = (e) => {
    // Prevent clicking the switch from triggering card onPress navigation
    toggleDevice(device.id);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isAlarming && styles.errorBorder,
        pressed && styles.pressedCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.leftSection}>
        <DeviceTypeIcon type={device.type} status={device.status} />
        
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {device.name}
          </Text>
          <Text style={styles.room}>
            {device.location?.room || 'General'}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        {isSwitchControlled ? (
          <Switch
            value={device.status === 'ON'}
            onValueChange={handleToggle}
            trackColor={{ false: colors.divider, true: `${colors.primary}50` }}
            thumbColor={device.status === 'ON' ? colors.primary : colors.textSecondary}
          />
        ) : (
          <DeviceStatusBadge status={device.status} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  errorBorder: {
    borderColor: 'rgba(255, 71, 87, 0.4)',
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
  },
  pressedCard: {
    backgroundColor: colors.surfaceHighlight,
    transform: [{ scale: 0.98 }],
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.small,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  room: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
