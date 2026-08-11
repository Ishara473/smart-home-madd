import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';

export default function FloorGrid({ width = 8, height = 8, gridSize = 40 }) {
  const gridWidth = width * gridSize;
  const gridHeight = height * gridSize;

  // Build grid columns and rows lines
  const cols = Array.from({ length: width - 1 });
  const rows = Array.from({ length: height - 1 });

  return (
    <View style={[styles.grid, { width: gridWidth, height: gridHeight }]}>
      {cols.map((_, i) => (
        <View
          key={`col-${i}`}
          style={[
            styles.lineVertical,
            { left: (i + 1) * gridSize, height: gridHeight }
          ]}
        />
      ))}
      
      {rows.map((_, i) => (
        <View
          key={`row-${i}`}
          style={[
            styles.lineHorizontal,
            { top: (i + 1) * gridSize, width: gridWidth }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#070b13',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  lineVertical: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  lineHorizontal: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
});
