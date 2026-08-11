import { useEffect } from 'react';
import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { shouldUseMockData } from '../../../services/firebase';

/**
 * Redirects unauthenticated users to login when Firebase mode is active.
 * Signed-in users on auth screens are sent to the main app.
 */
export function useAuthRouteGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || loading || shouldUseMockData()) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, navigationState?.key, router]);
}
