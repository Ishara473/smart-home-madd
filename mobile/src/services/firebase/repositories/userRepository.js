import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc, withUpdatedTimestamps } from './utils';

export const userRepository = {
  async getUserById(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return mapDoc(snapshot);
    } catch (error) {
      console.error('[userRepository] getUserById error', error);
      throw error;
    }
  },

  async updateUser(uid, data) {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, withUpdatedTimestamps(data));
    } catch (error) {
      console.error('[userRepository] updateUser error', error);
      throw error;
    }
  },

  async ensureUserDocument(firebaseUser) {
    try {
      const uid = firebaseUser.uid;
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        return mapDoc(snapshot);
      }

      const userData = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || null,
        currentHomeId: null,
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
      };

      await setDoc(docRef, userData);
      console.log('[userRepository] Created user document for:', uid);
      return userData;
    } catch (error) {
      console.error('[userRepository] ensureUserDocument error', error);
      throw error;
    }
  }
};