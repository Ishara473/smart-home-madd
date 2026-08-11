import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function LoadingIndicator({
  message = 'Loading...',
  color = colors.primary,
  size = 'large',
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: spacing.small,
    color: colors.textSecondary,
    fontSize: typography.sizes.bodySmall,
  },
});
