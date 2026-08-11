import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function ScreenContainer({
  children,
  style,
  useSafeArea = true,
  padding = true,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        useSafeArea && { paddingTop: insets.top },
        padding && styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padding: {
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.medium,
  },
});

