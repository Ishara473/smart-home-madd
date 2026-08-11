import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc } from './utils';

export const reportRepository = {
  async getReportsByHome(homeId) {
    try {
      const q = query(
        collection(db, 'reports'),
        where('homeId', '==', homeId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (error) {
      console.error('[reportRepository] getReportsByHome error', error);
      throw error;
    }
  },

  async getReportsByType(homeId, type) {
    try {
      const q = query(
        collection(db, 'reports'),
        where('homeId', '==', homeId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc)
        .filter(r => r.type === type)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (error) {
      console.error('[reportRepository] getReportsByType error', error);
      throw error;
    }
  }
};