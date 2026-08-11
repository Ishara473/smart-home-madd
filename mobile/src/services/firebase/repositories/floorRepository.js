import { collection, query, where, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc, withCreatedTimestamps } from './utils';

export const floorRepository = {
  async getFloorsByHome(homeId) {
    try {
      const q = query(
        collection(db, 'floors'),
        where('homeId', '==', homeId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc).sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('[floorRepository] getFloorsByHome error', error);
      throw error;
    }
  },

  async getFloorById(floorId, homeId) {
    try {
      if (homeId) {
        const q = query(
          collection(db, 'floors'),
          where('homeId', '==', homeId)
        );
        const snapshot = await getDocs(q);
        const match = snapshot.docs.find(d => d.id === floorId);
        if (!match) return null;
        return mapDoc(match);
      }
      const docRef = doc(db, 'floors', floorId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return mapDoc(snap);
    } catch (error) {
      console.error('[floorRepository] getFloorById error', error);
      throw error;
    }
  },

  async createFloor(floorData) {
    try {
      const docRef = await addDoc(
        collection(db, 'floors'),
        withCreatedTimestamps(floorData)
      );
      return { id: docRef.id, ...floorData };
    } catch (error) {
      console.error('[floorRepository] createFloor error', error);
      throw error;
    }
  }
};