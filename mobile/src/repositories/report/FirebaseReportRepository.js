import { reportRepository } from '../../services/firebase/repositories/reportRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

/**
 * Firebase Firestore Report Repository (src/repositories layer).
 */
export const FirebaseReportRepository = {
  getAll: async (homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return reportRepository.getReportsByHome(homeId);
  },

  getById: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const snapshot = await getDoc(doc(db, 'reports', id));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  },

  getByType: async (homeId, type) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return reportRepository.getReportsByType(homeId, type);
  },

  create: async (data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { setDoc, doc, collection } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const docRef = data.id ? doc(db, 'reports', data.id) : doc(collection(db, 'reports'));
    const { id, ...reportData } = data;
    await setDoc(docRef, { ...reportData, createdAt: new Date(), updatedAt: new Date() });
    return docRef.id;
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    const { updateDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    await updateDoc(doc(db, 'reports', id), { ...data, updatedAt: new Date() });
    return true;
  },

  remove: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    const { deleteDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    await deleteDoc(doc(db, 'reports', id));
    return true;
  },
};

export default FirebaseReportRepository;
