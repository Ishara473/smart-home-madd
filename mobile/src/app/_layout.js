import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { AppProvider } from '../context/AppProvider';
import '../services/firebase';
import { DeviceProvider } from '../features/devices';
import { ScheduleProvider } from '../features/scheduling';
import { HomeProvider } from '../features/home/context/HomeContext';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { useAuthRouteGuard } from '../features/auth/hooks/useAuthRouteGuard';
import { shouldUseMockData } from '../services/firebase';
import LoadingIndicator from '../shared/components/LoadingIndicator';
import { colors } from '../shared/theme/colors';

function RootNavigator() {
  const { loading } = useAuth();
  useAuthRouteGuard();

  const showAuthLoading = loading && !shouldUseMockData();

  if (showAuthLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator message="Checking session…" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="floors/index" options={{ title: 'Floors List' }} />
      <Stack.Screen name="floors/[id]" options={{ title: 'Floor Details' }} />
      <Stack.Screen name="floors/[id]/map" options={{ title: 'Floor Plan Map' }} />
      <Stack.Screen name="devices/[id]" options={{ title: 'Device Details' }} />
      <Stack.Screen name="schedules/index" options={{ title: 'Schedules List' }} />
      <Stack.Screen name="schedules/[id]" options={{ title: 'Schedule Details' }} />
      <Stack.Screen name="schedules/manage" options={{ title: 'Schedule Management' }} />
      <Stack.Screen name="cameras/index" options={{ title: 'Cameras List' }} />
      <Stack.Screen name="cameras/[id]" options={{ title: 'Camera Stream' }} />
      <Stack.Screen name="notifications/index" options={{ title: 'Notifications' }} />
      <Stack.Screen name="notifications/[id]" options={{ title: 'Notification Details' }} />
      <Stack.Screen name="reports/index" options={{ title: 'Reports & Analytics' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <HomeProvider>
            <DeviceProvider>
              <ScheduleProvider>
                <RootNavigator />
              </ScheduleProvider>
            </DeviceProvider>
          </HomeProvider>
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
