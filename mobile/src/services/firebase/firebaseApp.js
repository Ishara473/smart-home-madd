import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { firebaseConfig, isConfigValid } from './firebaseConfig.js';

let app = null;
let db = null;
let auth = null;
let storage = null;

if (isConfigValid) {
  try {
    // Ensures initialization occurs only once across hot-reloads / Fast Refresh in Expo
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    // --- EMULATOR PREPARATION ---
    // Keep this structure ready for future local development with Firebase Emulator Suite.
    // Do NOT enable emulator connections yet.
    const USE_EMULATOR = false; // Toggle this when emulator support is required
    
    if (USE_EMULATOR && typeof __DEV__ !== 'undefined' && __DEV__) {
      // connectFirestoreEmulator(db, '127.0.0.1', 8080);
      // connectAuthEmulator(auth, 'http://127.0.0.1:9099');
      // connectStorageEmulator(storage, '127.0.0.1', 9199);
      // console.log('🔥 [Firebase] Connected to Emulator Suite');
    }

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(
        `🔥 [Firebase] Firebase initialized successfully!\n` +
        `   • App Name: ${app?.name || 'Default'}\n` +
        `   • Project ID: ${firebaseConfig.projectId}\n` +
        `   • Firestore ready`
      );
    }
  } catch (error) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn('[Firebase] Initialization error:', error.message);
    }
  }
} else if (getApps().length > 0) {
  app = getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

export { app, db, auth, storage };
export default app;
