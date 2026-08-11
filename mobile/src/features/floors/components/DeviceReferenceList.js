import React from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceReferenceItem from './DeviceReferenceItem';
import { spacing } from '../../../shared/theme/spacing';

export default function DeviceReferenceList({ deviceIds }) {
  if (!deviceIds || deviceIds.length === 0) return null;

  return (
    <View style={styles.container}>
      {deviceIds.map((id) => (
        <DeviceReferenceItem key={id} deviceId={id} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.small,
  },
});
