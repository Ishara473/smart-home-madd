import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../../../services/firebase/authService';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { userRepository } from '../../../services/firebase/repositories';

export const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// Synthetic mock user for development (EXPO_PUBLIC_USE_MOCK_DATA=true)
const MOCK_USER = {
  uid: 'test-user-123',
  email: 'ishara@example.com',
  displayName: 'Ishara',
  photoURL: null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shouldUseMockData()) {
      // In mock mode, provide a synthetic user so the rest of the app can function
      setUser(MOCK_USER);
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    // Subscribe to real Firebase Auth state
    const unsubscribe = authService.subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Ensure user document exists after authentication
      if (firebaseUser) {
        try {
          await userRepository.ensureUserDocument(firebaseUser);
        } catch (err) {
          console.error('[AuthContext] Failed to ensure user document', err);
          // Don't block authentication on user document creation failure
          // The user can still sign in, but may need to retry or handle initialization
        }
      }
      
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (shouldUseMockData()) return;
    try {
      setError(null);
      const firebaseUser = await authService.signIn(email, password);
      // Ensure user document exists after successful sign in
      await userRepository.ensureUserDocument(firebaseUser);
    } catch (err) {
      console.error('[AuthContext] signIn failed', err);
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email, password, displayName) => {
    if (shouldUseMockData()) return;
    try {
      setError(null);
      const firebaseUser = await authService.signUp(email, password, displayName);
      // User document is already created by authService.signUp, but ensure it exists
      await userRepository.ensureUserDocument(firebaseUser);
    } catch (err) {
      console.error('[AuthContext] signUp failed', err);
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    if (shouldUseMockData()) return;
    try {
      setError(null);
      await authService.signOut();
    } catch (err) {
      console.error('[AuthContext] signOut failed', err);
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
