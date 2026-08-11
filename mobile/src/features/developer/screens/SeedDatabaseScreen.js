import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../auth/context/AuthContext';
import { isFirebaseConfigured, shouldUseMockData } from '../../../services/firebase';
import { isFirebaseOnline } from '../../../services/firebase/firebaseStatus';
import { seedFirestore } from '../../../services/firebase/seed';
import { userRepository } from '../../../services/firebase/repositories';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase/firebaseApp';
import ScreenContainer from '../../../shared/components/ScreenContainer';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { borders } from '../../../shared/theme/borders';

export default function SeedDatabaseScreen() {
  const { user } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [firebaseStatus, setFirebaseStatus] = useState(null);
  const [userDocExists, setUserDocExists] = useState(false);
  const [currentHomeId, setCurrentHomeId] = useState(null);
  const [homeExists, setHomeExists] = useState(false);
  const [checkingDiagnostics, setCheckingDiagnostics] = useState(true);

  const checkFirebaseStatus = async () => {
    const online = await isFirebaseOnline();
    setFirebaseStatus(online ? 'Online' : 'Offline');
  };

  const checkDiagnostics = async () => {
    if (!user || shouldUseMockData() || !isFirebaseConfigured()) {
      setCheckingDiagnostics(false);
      return;
    }

    try {
      // Check if user document exists
      const userDoc = await userRepository.getUserById(user.uid);
      setUserDocExists(!!userDoc);
      
      if (userDoc) {
        setCurrentHomeId(userDoc.currentHomeId);
        
        // Check if home exists
        if (userDoc.currentHomeId) {
          const homeDocRef = doc(db, 'homes', userDoc.currentHomeId);
          const homeDoc = await getDoc(homeDocRef);
          setHomeExists(homeDoc.exists());
        }
      }
    } catch (err) {
      console.error('[SeedDatabaseScreen] Diagnostic check failed', err);
    } finally {
      setCheckingDiagnostics(false);
    }
  };

  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  useEffect(() => {
    checkDiagnostics();
  }, [user]);

  const handleSeed = async () => {
    if (!__DEV__) {
      Alert.alert('Development Only', 'This function is only available in development mode.');
      return;
    }

    if (shouldUseMockData()) {
      Alert.alert('Mock Mode Active', 'Cannot seed Firestore while using mock data. Set EXPO_PUBLIC_USE_MOCK_DATA=false in .env');
      return;
    }

    if (!isFirebaseConfigured()) {
      Alert.alert('Firebase Not Configured', 'Firebase credentials are not configured. Check your .env file.');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Required', 'You must be signed in with Firebase Auth to seed the database. The seed will create data for your authenticated user account.');
      return;
    }
    
    const message = `This will overwrite existing Firestore documents with mock data for your authenticated user (${user.uid}). Are you sure?`;
    
    if (Platform.OS === 'web') {
      // Use browser's native confirm dialog for web
      if (window.confirm(message)) {
        executeSeed();
      }
    } else {
      // Use Alert.alert for mobile with custom buttons
      Alert.alert(
        'Confirm Seed',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Seed',
            style: 'destructive',
            onPress: executeSeed,
          },
        ]
      );
    }
  };

  const executeSeed = async () => {
    console.log('[SeedDatabaseScreen] executeSeed called');
    setSeeding(true);
    setStatus('Starting seed...');
    setError('');

    try {
      console.log('[SeedDatabaseScreen] Calling seedFirestore');
      await seedFirestore();
      console.log('[SeedDatabaseScreen] seedFirestore completed successfully');
      setStatus('Seed completed successfully!');
      // Refresh diagnostics after successful seed
      await checkDiagnostics();
      Alert.alert('Success', 'Firestore database has been seeded with mock data.');
    } catch (err) {
      console.error('[SeedDatabaseScreen] seedFirestore failed:', err);
      setError(err.message || 'Seed failed');
      setStatus('Seed failed');
      Alert.alert('Error', 'Failed to seed database. Check console for details.');
    } finally {
      setSeeding(false);
    }
  };

  if (!__DEV__) {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <Text style={styles.title}>Development Only</Text>
          <Text style={styles.message}>This screen is only available in development builds.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Developer Tools</Text>
          <Text style={styles.subtitle}>Firestore Database Seed</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          
          <View style={styles.statusRow}>
            <Text style={styles.label}>Development Mode:</Text>
            <Text style={[styles.value, styles.success]}>Enabled</Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Data Mode:</Text>
            <Text style={[styles.value, shouldUseMockData() ? styles.warning : styles.success]}>
              {shouldUseMockData() ? 'Mock Data' : 'Firebase'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Firebase Configured:</Text>
            <Text style={[styles.value, isFirebaseConfigured() ? styles.success : styles.error]}>
              {isFirebaseConfigured() ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Firebase Status:</Text>
            <Text style={[styles.value, firebaseStatus === 'Online' ? styles.success : styles.error]}>
              {firebaseStatus || 'Checking...'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Authenticated User:</Text>
            <Text style={[styles.value, user ? styles.success : styles.error]}>
              {user ? user.uid : 'Not signed in'}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>User Document Exists:</Text>
            <Text style={[styles.value, checkingDiagnostics ? styles.warning : (userDocExists ? styles.success : styles.error)]}>
              {checkingDiagnostics ? 'Checking...' : (userDocExists ? 'Yes' : 'No')}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Current Home ID:</Text>
            <Text style={[styles.value, checkingDiagnostics ? styles.warning : styles.success]}>
              {checkingDiagnostics ? 'Checking...' : (currentHomeId || 'None')}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Home Exists:</Text>
            <Text style={[styles.value, checkingDiagnostics ? styles.warning : (homeExists ? styles.success : styles.error)]}>
              {checkingDiagnostics ? 'Checking...' : (homeExists ? 'Yes' : 'No')}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Database Initialized:</Text>
            <Text style={[styles.value, checkingDiagnostics ? styles.warning : (userDocExists && homeExists ? styles.success : styles.error)]}>
              {checkingDiagnostics ? 'Checking...' : (userDocExists && homeExists ? 'Yes' : 'No')}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Ready To Seed:</Text>
            <Text style={[styles.value, checkingDiagnostics ? styles.warning : (user && userDocExists && !homeExists ? styles.success : styles.warning)]}>
              {checkingDiagnostics ? 'Checking...' : (user && userDocExists && !homeExists ? 'Yes' : (homeExists ? 'Already seeded' : 'No'))}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seed Database</Text>
          <Text style={styles.description}>
            This will populate Firestore with mock data for testing. All existing documents will be overwritten.
          </Text>

          {status ? (
            <View style={[styles.statusBox, error ? styles.errorBox : styles.successBox]}>
              <Text style={[styles.statusText, error ? styles.errorText : styles.successText]}>
                {status}
              </Text>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.seedButton,
                seeding && styles.seedButtonDisabled,
                (!user || shouldUseMockData() || !isFirebaseConfigured()) && styles.seedButtonDisabled,
              ]}
              onPress={handleSeed}
              disabled={seeding || !user || shouldUseMockData() || !isFirebaseConfigured()}
            >
              <Text style={styles.seedButtonText}>
                {seeding ? 'Seeding...' : 'Seed Firestore Database'}
              </Text>
              {seeding && (
                <ActivityIndicator color={colors.textPrimary} style={styles.buttonSpinner} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.warningSection}>
          <Text style={styles.warningTitle}>⚠️ Warning</Text>
          <Text style={styles.warningText}>
            This operation will overwrite existing Firestore data. Use only in development environments.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },
  scrollContent: {
    paddingVertical: spacing.large,
  },
  header: {
    marginBottom: spacing.large,
  },
  title: {
    fontSize: typography.sizes.headingLarge,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.small,
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  message: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    fontSize: typography.sizes.headingSmall,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.medium,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.small,
    borderBottomWidth: borders.width.thin,
    borderBottomColor: colors.divider,
  },
  label: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
  },
  success: {
    color: colors.success,
  },
  error: {
    color: colors.danger,
  },
  warning: {
    color: colors.warning,
  },
  description: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
    lineHeight: typography.lineHeights.body,
  },
  statusBox: {
    padding: spacing.medium,
    borderRadius: borders.radius.small,
    marginBottom: spacing.medium,
  },
  successBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: borders.width.thin,
    borderColor: colors.success,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: borders.width.thin,
    borderColor: colors.danger,
  },
  statusText: {
    fontSize: typography.sizes.body,
  },
  successText: {
    color: colors.success,
  },
  errorText: {
    color: colors.danger,
  },
  buttonContainer: {
    marginTop: spacing.small,
  },
  seedButton: {
    backgroundColor: colors.primary,
    borderRadius: borders.radius.medium,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seedButtonDisabled: {
    opacity: 0.5,
  },
  seedButtonText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.titleLarge,
    fontWeight: typography.weights.semiBold,
  },
  buttonSpinner: {
    marginLeft: spacing.small,
  },
  warningSection: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: borders.radius.medium,
    padding: spacing.medium,
    borderWidth: borders.width.thin,
    borderColor: colors.warning,
  },
  warningTitle: {
    fontSize: typography.sizes.headingSmall,
    fontWeight: typography.weights.semiBold,
    color: colors.warning,
    marginBottom: spacing.small,
  },
  warningText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.body,
  },
});
