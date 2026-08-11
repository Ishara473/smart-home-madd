import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDevices } from '../../devices';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';

export default function ActionSummary({ action, textStyle }) {
  const { devices } = useDevices();

  if (!action || !action.deviceId) {
    return <Text style={[styles.fallbackText, textStyle]}>Unknown action</Text>;
  }

  const device = devices.find(d => d.id === action.deviceId);
  const deviceName = device ? device.name : `Device (${action.deviceId})`;

  const formatCommandText = () => {
    const { command } = action;
    if (!command) return `Trigger command on ${deviceName}`;

    if (command.hasOwnProperty('power')) {
      return `Turn ${command.power ? 'ON' : 'OFF'} ${deviceName}`;
    }
    if (command.hasOwnProperty('recording')) {
      return `${command.recording ? 'Enable' : 'Disable'} recording on ${deviceName}`;
    }
    if (command.hasOwnProperty('motionDetection')) {
      return `${command.motionDetection ? 'Enable' : 'Disable'} motion alerts on ${deviceName}`;
    }
    if (command.hasOwnProperty('targetTemperature')) {
      return `Set target setpoint to ${command.targetTemperature}°C on ${deviceName}`;
    }
    return `Update specifications on ${deviceName}`;
  };

  return (
    <Text style={[styles.text, textStyle]} numberOfLines={2}>
      {formatCommandText()}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  fallbackText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
});
