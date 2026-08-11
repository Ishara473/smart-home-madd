import React, { createContext, useState, useEffect, useContext } from 'react';
import { homeRepository } from '../../../services/firebase/repositories';
import { userRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { dashboardMockData } from '../../dashboard/data/dashboardMockData';
import { useAuth } from '../../auth/context/AuthContext';

// Mock home for development (EXPO_PUBLIC_USE_MOCK_DATA=true)
const MOCK_HOME_ID = 'home-main';
const MOCK_HOME = {
  id: MOCK_HOME_ID,
  name: dashboardMockData.homeOverview.name,
  floorsCount: dashboardMockData.homeOverview.floorsCount,
  totalDevices: dashboardMockData.homeOverview.totalDevices,
  activeDevices: dashboardMockData.homeOverview.activeDevices,
  securityStatus: dashboardMockData.quickStatus.security,
};

export const HomeContext = createContext({
  home: null,
  homeId: null,
  loading: true,
  needsInitialization: false,
  error: null,
});

export function HomeProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [home, setHome] = useState(null);
  const [homeId, setHomeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsInitialization, setNeedsInitialization] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to resolve before attempting any data fetch
    if (authLoading) return;

    if (shouldUseMockData()) {
      setHome(MOCK_HOME);
      setHomeId(MOCK_HOME_ID);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured.');
      setLoading(false);
      return;
    }

    if (!user) {
      // User is not authenticated — clear home state
      setHome(null);
      setHomeId(null);
      setLoading(false);
      return;
    }

    // Step 1: Load the user document to discover their currentHomeId
    setLoading(true);
    setNeedsInitialization(false);
    setError(null);
    let homeUnsubscribe = null;

    userRepository.getUserById(user.uid)
      .then((userDoc) => {
        const resolvedHomeId = userDoc?.currentHomeId || null;

        if (!resolvedHomeId) {
          // User has no home assigned - this is a valid bootstrap state
          setNeedsInitialization(true);
          setLoading(false);
          return;
        }

        setHomeId(resolvedHomeId);

        // Step 2: Subscribe to real-time home updates
        homeUnsubscribe = homeRepository.subscribeToHome(resolvedHomeId, (homeData) => {
          if (homeData) {
            setHome(homeData);
            setError(null);
          } else {
            setError('Home document not found in Firestore.');
          }
          setLoading(false);
        });
      })
      .catch((err) => {
        console.error('[HomeContext] Failed to load user document', err);
        setError('Unable to load home data. Check your connection.');
        setLoading(false);
      });

    return () => {
      if (homeUnsubscribe) homeUnsubscribe();
    };
  }, [user, authLoading]);

  return (
    <HomeContext.Provider value={{ home, homeId, loading, needsInitialization, error }}>
      {children}
    </HomeContext.Provider>
  );
}

export const useHomeContext = () => useContext(HomeContext);
