import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc } from './utils';

export const cameraRepository = {
  async getCamerasByHome(homeId) {
    try {
      const q = query(collection(db, 'cameras'), where('homeId', '==', homeId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc);
    } catch (error) {
      console.error('[cameraRepository] getCamerasByHome error', error);
      throw error;
    }
  },

  async getCameraByDeviceId(deviceId) {
    try {
      const q = query(collection(db, 'cameras'), where('deviceId', '==', deviceId));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return mapDoc(snapshot.docs[0]);
    } catch (error) {
      console.error('[cameraRepository] getCameraByDeviceId error', error);
      throw error;
    }
  },

  subscribeToCameras(homeId, callback) {
    try {
      const q = query(collection(db, 'cameras'), where('homeId', '==', homeId));
      return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(mapDoc));
      }, (error) => {
        console.error('[cameraRepository] subscribeToCameras error', error);
      });
    } catch (error) {
      console.error('[cameraRepository] subscribeToCameras setup error', error);
      throw error;
    }
  }
};