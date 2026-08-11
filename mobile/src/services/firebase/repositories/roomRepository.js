import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc } from './utils';

export const roomRepository = {
  async getRoomsByFloor(floorId, homeId) {
    try {
      const q = query(
        collection(db, 'rooms'),
        where('floorId', '==', floorId)
      );
      const snapshot = await getDocs(q);
      let results = snapshot.docs.map(mapDoc);
      if (homeId) {
        results = results.filter(r => r.homeId === homeId);
      }
      return results;
    } catch (error) {
      console.error('[roomRepository] getRoomsByFloor error', error);
      throw error;
    }
  },

  async getRoomById(roomId) {
    try {
      const docRef = doc(db, 'rooms', roomId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return mapDoc(snapshot);
    } catch (error) {
      console.error('[roomRepository] getRoomById error', error);
      throw error;
    }
  }
};