import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc, withUpdatedTimestamps } from './utils';

export const homeRepository = {
  async getHomeById(homeId) {
    try {
      const docRef = doc(db, 'homes', homeId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return mapDoc(snapshot);
    } catch (error) {
      console.error('[homeRepository] getHomeById error', error);
      throw error;
    }
  },

  subscribeToHome(homeId, callback) {
    try {
      const docRef = doc(db, 'homes', homeId);
      return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(mapDoc(snapshot));
        } else {
          callback(null);
        }
      }, (error) => {
        console.error('[homeRepository] subscribeToHome error', error);
      });
    } catch (error) {
      console.error('[homeRepository] subscribeToHome setup error', error);
      throw error;
    }
  },

  async updateHome(homeId, data) {
    try {
      const docRef = doc(db, 'homes', homeId);
      await updateDoc(docRef, withUpdatedTimestamps(data));
    } catch (error) {
      console.error('[homeRepository] updateHome error', error);
      throw error;
    }
  }
};