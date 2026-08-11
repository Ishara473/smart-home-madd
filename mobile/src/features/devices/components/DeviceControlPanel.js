import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LightControl from './controls/LightControl';
import OutletControl from './controls/OutletControl';
import FanControl from './controls/FanControl';
import ThermostatControl from './controls/ThermostatControl';
import CameraControl from './controls/CameraControl';
import IronControl from './controls/IronControl';
import SwitchControl from './SwitchControl';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function DeviceControlPanel({ device, updateDeviceState, toggleSubSwitch }) {
  if (!device) return null;

  const renderControl = () => {
    switch (device.type) {
      case 'LIGHT':
        return (
          <LightControl
            device={device}
            updateDeviceState={updateDeviceState}
          />
        );
      case 'OUTLET':
        return (
          <OutletControl
            device={device}
            updateDeviceState={updateDeviceState}
          />
        );
      case 'IRON':
        return (
          <IronControl
            device={device}
            updateDeviceState={updateDeviceState}
          />
        );
      case 'FAN':
        return (
          <FanControl
            device={device}
            updateDeviceState={updateDeviceState}
          />
        );
      case 'THERMOSTAT':
        return (
          <ThermostatControl
            device={device}
            updateDeviceState={updateDeviceState}
          />
        );
      case 'CAMERA':
        return <CameraControl device={device} />;
      case 'SWITCH_PANEL':
        const currentSwitches = device.state?.switches || device.switches || [];
        return (
          <View style={styles.switchPanelBox}>
            <Text style={styles.subTitle}>Multi-gang Switch Unit Details</Text>
            {currentSwitches.map((sw, idx) => {
              const swId = sw.id !== undefined ? sw.id : (idx + 1);
              const swStatus = sw.status || sw.state || 'OFF';
              return (
                <SwitchControl
                  key={sw.id || sw.name || idx}
                  name={sw.name}
                  status={swStatus}
                  onToggle={() => toggleSubSwitch(device.id, swId)}
                />
              );
            })}
          </View>
        );
      default:
        return (
          <View style={styles.fallbackBox}>
            <Text style={styles.fallbackText}>
              No controls available for device type: {device.type}
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Device Controls</Text>
      {renderControl()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.small,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.small,
  },
  switchPanelBox: {
    backgroundColor: colors.surface,
    padding: spacing.medium,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  subTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    marginBottom: spacing.medium,
  },
  fallbackBox: {
    backgroundColor: colors.surface,
    padding: spacing.medium,
    borderRadius: borders.radius.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.divider,
  },
  fallbackText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
    textAlign: 'center',
  },
});
