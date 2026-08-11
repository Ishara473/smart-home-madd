import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseApp';

/**
 * Firebase Authentication Service Layer.
 * Pure service — no React, no UI logic.
 * Consumed by AuthContext.
 */

/**
 * Create a new user account and write the initial user document to Firestore.
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<import('firebase/auth').User>}
 */
export const signUp = async (email, password, displayName) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Set display name on the Auth profile
  await updateProfile(user, { displayName });

  // Write the initial user document to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    displayName,
    email: user.email,
    photoURL: null,
    currentHomeId: null, // Will be set when a home is created or joined
    role: 'OWNER',
    preferences: {
      temperatureUnit: 'CELSIUS',
      theme: 'DARK',
      language: 'en',
    },
    notifications: {
      pushEnabled: true,
      securityAlerts: true,
      deviceAlerts: true,
      automationAlerts: false,
    },
    fcmToken: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
};

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').User>}
 */
export const signIn = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  await firebaseSignOut(auth);
};

/**
 * Get the currently signed-in user synchronously.
 * @returns {import('firebase/auth').User | null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribe to Firebase Auth state changes.
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
