import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useHomeContext } from '../../../features/home/context/HomeContext';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { home } = useHomeContext();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user?.displayName || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>User ID</Text>
              <Text style={styles.valueSmall}>{user?.uid || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Home</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Home Name</Text>
              <Text style={styles.value}>{home?.name || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{home?.address || 'N/A'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Security</Text>
              <Text style={[styles.value, { color: home?.securityStatus === 'ARMED' ? colors.success : colors.warning }]}>
                {home?.securityStatus || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => router.push('/developer/seed')}>
              <Text style={styles.label}>Developer Tools</Text>
              <Text style={[styles.value, { color: colors.primary }]}>Seed DB →</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Data Mode</Text>
              <Text style={styles.value}>Firebase (Live)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>App Version</Text>
              <Text style={styles.value}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.dangerButton} onPress={handleSignOut}>
          <Text style={styles.dangerButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: spacing.large,
  },
  section: {
    marginBottom: spacing.large,
    paddingHorizontal: spacing.medium,
  },
  sectionTitle: {
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.semiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.small,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.small,
  },
  label: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  valueSmall: {
    fontSize: typography.sizes.bodySmall,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
    maxWidth: 180,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  dangerButton: {
    marginHorizontal: spacing.medium,
    marginTop: spacing.medium,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: borders.radius.medium,
    paddingVertical: spacing.medium,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: colors.danger,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semiBold,
  },
});
